#!/bin/bash
# //  v1.25-0
# //  Constroi e insere (ou retorna) automaticamente um metodo construtor de uma classe em qualquer codigo Java.
# //  Created by Micael Levi on 10/23/2016
# //  Copyright (c) 2016 mllc@icomp.ufam.edu.br; All rights reserved.
# //



## TODO
## necessidade de acrescentar uma tag no código.
## dependências externas,
## PROGRAMAS: echo, printf, sed, perl, cat, grep, tail, mktemp.
## SCRIPTS: removerComentarios.sed, constructorGenerator.pl.


# --------------------[ CONFIGURAÇÕES ]-------------------- #
readonly REMOVER_COMENTARIOS="removerComentarios.sed"
readonly GERADOR_CONSTRUTOR="constructorGenerator.pl"
readonly binSed="sed -nf"
readonly binPerl="perl"
# readonly binSed="/usr/bin/sed -nf"
# readonly binPerl="/usr/bin/perl"
readonly sep=:
# ----------------------------------------------------------- #

# --------------------[ DEFAULT DAS OPÇÕES ]-------------------- #
Verbose=0   # nao mostra o log (3).
InPlace=0   # mostra na STDOUT (2).
OverWrite=0 # nao insere o construtor se ja exisitir.
Delete=0    # nao apaga a linha da tag.
OneLine=0   # construtor identado.
Quiet=0     # cometario de Auto-generated.
Sorted=0    # parametros inseridos na ordem das declaracoes.
# -------------------------------------------------------------- #

# --------------------[ VARIÁVEIS GLOBAIS READONLY ]---------------------- #
OPTS_PERL=
SUFIX=""
FILEPATH=""
NOME_CONSTRUTOR=""
declare -i QTD_ATT=0
declare -i LINHA_TAG=0
declare -a ATRIBUTOS=0
declare -i LINHA_INSERCAO=-1
CONSTRUTOR=""
PROTOTIPO=""
declare -i CONSTRUTOR_EXISTE=0
declare -i QTD_CONSTRUTORES=0
ARQ_CONSTRUTOR=""
# ------------------------------------------------------------------------- #





NOT(){
  if(($1)); then
    echo 0
  else
    echo 1
  fi
}


_showLogMessage(){
  [ $# -lt 1 ] && return;

  local msg="[${1^^}]";
  local N=$(($RANDOM % 8 + 31));
  msg="\033[40;${N};1m${msg}\033[m";
  [[ -z "$2" ]] && echo -e "$msg" 1>&2 || echo -e "$msg" 1>&3 2>&4;
}
_ERRO(){
  [ $# -lt 1 ] && return;
  _showLogMessage "$1" "MOSTRAR";
}
_criarArquivoTempComConteudo(){
  _showLogMessage "CRIANDO ARQUIVO TEMPORÁRIO"


  local tempFile=$(mktemp "${TMPDIR:-/tmp/}XXXXXXXX.construtor");
  printf "$1" > $tempFile;
  echo $tempFile;
}


_checkDependencies(){
  _showLogMessage "verificando dependecias";
  local ERROR=;

  if not command -v perl >/dev/null 2>&1; then ERROR+=1; fi
  if not command -v sed >/dev/null 2>&1; then ERROR+=2; fi
  if not command -v cat >/dev/null 2>&1; then ERROR+=3; fi
  if not command -v grep >/dev/null 2>&1; then ERROR+=4; fi
  if not command -v tail >/dev/null 2>&1; then ERROR+=5; fi
  if not command -v mktemp >/dev/null 2>&1; then ERROR+=6; fi

  [ -r "$REMOVER_COMENTARIOS" ] || ERROR+=7
  [ -r "$GERADOR_CONSTRUTOR" ] || ERROR+=8
  ((ERROR)) && {
    _ERRO "Erro nas dependencias! ($ERROR)";
    exit 10;
  }
}


_help(){
  echo -e "\
  USSAGE: \033[36;1m${0}\033[m \033[40;33m[OPTIONS] [-mN, --modifierN] [-i[SUFIX], --in-place[=SUFIX]]\033[m \033[40;31mpathToFile.java\033[m
  OPTIONS:
    -h        --help        :mostrar ajuda. [false]
    -v        --verbose     :mostrar logs. [false]
    -o        --over-write  :inserir mesmo que ja exista um construtor com o mesmo prototipo. [false]
    -d        --delete      :remover a linha que contem a tag. [false]
    -l        --one-line    :o metodo construtor tera apenas uma linha. [false]
    -q        --quiet       :nao mostrar linha de comentario 'Auto-generated'. [false]
    -S        --sorted      :os parametros serao inseridos de forma ordenada (alfabetica pelo nome da variavel). [false]\
    "
  exit 1
}
_especificacoes(){
  cat <<EOF
  1. Caso exista o construtor default, ele não deve conter escopos locais.
  2. Um linha (comentada) com a TAG  "@attN"  deve anteceder as declarações dos atributos, onde "N" é a quantidade de atributos.
  3. Os atributos da classe devem estar declarados UM por linha.
  4. Por padrão, os parâmetros são inseridos na ordem em que eles aparecem (na declaração).
EOF
  echo
  _help;
  exit 2;
}


#### [ LER E DEFINIR ATRIBUTOS ] ####
_atributos(){
  _showLogMessage "LENDO E DEFININDO ATRIBUTOS";


  FILENAME=$(grep -Poie '\w+\.java' <<< ${FILEPATH} | sed -r 's/(.)/\U\1/');
  readonly NOME_CONSTRUTOR="${FILENAME%%.java}";

  readonly ANALISE=$(grep -n -m1 -Po '(?<=@att)[[:blank:]]*(\d+)' ${FILEPATH}); ## <numeroDaLinha>:<quantidadeDeAtributos> DO ARQUIVO ORIGINAL
  [[ -z "$ANALISE" ]] && { _ERRO "a tag não foi encontrada"; _especificacoes; }
  QTD_ATT=$(grep -Po '(?<=:)[[:blank:]]*\d' <<< "$ANALISE"); # cut -d: -f2

  # ARQUIVO_TRATADO=$(_criarArquivoTempComConteudo "$CONTEUDO_TRATADO");
  readonly ARQUIVO="$(sed -r "s/.*(@att[[:blank:]]*${QTD_ATT}).*/\1/1" ${FILEPATH} | ${binSed} ${REMOVER_COMENTARIOS} | sed '/^[[:blank:]]*$/d ; s/^[[:blank:]]*//')";
  LINHA_TAG=$(sed -n "/@att[[:blank:]]*${QTD_ATT}/{=;q;}" <<< "${ARQUIVO}");
  [[ -z "$ARQUIVO" || $LINHA_TAG -eq 0 ]] && { _ERRO "erro ao ler linha da tag"; exit 4; }

  local linhaInicial=$((LINHA_TAG+1));      # linha em que se inicia as declarações.
  local linhaFinal=$((LINHA_TAG+QTD_ATT));  # linha que tem a última declaração.

  ATRIBUTOSstr=$(sed -n "${linhaInicial} , ${linhaFinal} p" <<< "$ARQUIVO" | sed -r "s/(\w+)[[:blank:]]+(\w+)\W*/\2${sep}\1/");
  ## FIXME
  # use:  ((?:\w+\s+\w+)|(?:\w+))\s*(?:=\s*[^;,]+[;,])?
  # para obter apenas os nomes e tipos dos atributos no grupo 1; verificar se é apenas uma palavra, então tem o mesmo tipo que a anterior

  ((Sorted)) && ATRIBUTOSstr=$(sort -d <<< "$ATRIBUTOSstr");

  ATRIBUTOS=($ATRIBUTOSstr);

  [[ $QTD_ATT -ne ${#ATRIBUTOS[@]} ]] && { _showLogMessage "a quantidade de atributos não confere com a especificada pela tag"; exit 5; }
}


#### [ OBTER LINHA EM QUE O CODIGO DO CONSTRUTOR SERÁ INSERIDO ] ####
_linhaConstrutor(){
  _showLogMessage "RECUPERANDO LINHA EM QUE SERÁ INSERIDO"


  #1) Se o construtor default estiver presente (recupera a linha da última chave)
  LINHA_INSERCAO=$(sed -rn "/${NOME_CONSTRUTOR}[[:blank:]]*\(\)/ , /}/ =" ${FILEPATH} | tail -1);

  #2) Se o construtor default não estiver no código (recupera a linha da última chave fechada)
  # [[ $LINHA_INSERCAO -le 0 ]] && LINHA_INSERCAO=$(sed -n '/}/{ $b; =; }' ${FILEPATH} | tail -1);
  [[ $LINHA_INSERCAO -le 0 ]] && { LINHA_INSERCAO=$(sed -n '/}/=' ${FILEPATH} | tail -1); ((--LINHA_INSERCAO)); }
  [[ $LINHA_INSERCAO -le 0 ]] && { _ERRO "erro ao identificar a linha de inserção"; exit 6; }
}


#### [ GERAR O MÉTODO CONSTRUTOR PARAMETRIZADO ] ####
_gerarConstrutor(){
  _showLogMessage "GERANDO O MÉTODO CONSTRUTOR PARAMETRIZADO"

  readonly CONSTRUTOR="$(${binPerl} ${GERADOR_CONSTRUTOR} $OPTS_PERL $FILENAME ${ATRIBUTOS[@]})";
  readonly PROTOTIPO="$(grep -m1 -Eo '\w+\(.+\)' <<< "$CONSTRUTOR" |  sed -r 's/[[:blank:]]*(\w+)[[:blank:]]+\w+([,)])/\\W*\1[^,]+\2/g')";

  #### [ VERIFICAR SE ALGUM CONSTRUTOR COM A MESMA QUANTIDADE DE ATRIBUTOS] ####
  ((OverWrite)) || CONSTRUTOR_EXISTE=$(grep -c -E "${PROTOTIPO}" ${FILEPATH});
}


_alterarArquivo(){
  _showLogMessage "ALTERANDO (OU NÃO) ARQUIVO ORIGINAL"

  #### [ CRIAR ARQUIVO TEMPORÁRIO CUJO O CONTEÚDO SEJA O CONSTRUTOR ] ####
  readonly ARQ_CONSTRUTOR=$(_criarArquivoTempComConteudo "\n$CONSTRUTOR\n");
  # cat $ARQ_CONSTRUTOR;
  # local COMANDO_SED="${Delete:+"/@att[[:blank:]]*${QTD_ATT}/{d;q}; "} ${LINHA_INSERCAO}r ${ARQ_CONSTRUTOR}";
  local COMANDO_SED="${LINHA_INSERCAO}r ${ARQ_CONSTRUTOR}";
  local OPTS_SED=

  #### [ INSERIR O CONSTRUTOR NO ARQUIVO PASSADO NA LINHA ENCONTRADA ] ####
  ((InPlace)) && OPTS_SED=-i${SUFIX}
  ((CONSTRUTOR_EXISTE)) && COMANDO_SED="";
  ((Delete)) && COMANDO_SED="/@att[[:blank:]]*${QTD_ATT}/{d;q}; $COMANDO_SED";

  sed $OPTS_SED -e "${COMANDO_SED}" "$FILEPATH";

  rm -f $ARQ_CONSTRUTOR;
}




_main(){

  exec 3>&1
  exec 4>&2
  (($Verbose)) || exec 2>/dev/null;

  _checkDependencies;

  FILEPATH=${@%% };
  [ ! -r "$FILEPATH" ] && _especificacoes;



  ####################
  _atributos;
  _linhaConstrutor;
  _gerarConstrutor;
  _alterarArquivo;
  ####################

}



#####################################################################################################################

[ $# -eq 0 ] && _especificacoes;

OPTS=`getopt -o :hvodlqSm:i: --long help,verbose,over-write,delete,one-line,quiet,sorted,in-place: -n 'parse-options' -- "$@"`
[ $? != 0 ] && _help ;
eval set -- "$OPTS";
while :
do
  opt="";
  case "$1" in
    -h | --help ) _help; opt=h ;;
    -v | --verbose ) Verbose=$(NOT $Verbose) ;;
    -o | --over-write ) OverWrite=$(NOT $OverWrite);;
    -d | --delete ) Delete=$(NOT $Delete) ;;
    -l | --one-line ) OneLine=$(NOT $OneLine); opt=l ;;
    -q | --quiet ) Quiet=$(NOT $Quiet); opt=q ;;
    -S | --sorted ) Sorted=$(NOT $Sorted) ;;
    -m | --modifier ) [ -n "$4" ] && { opt=m${2:0:1}; shift; } ;;
    -i | --in-place ) InPlace=$(NOT $InPlace); SUFIX=${4:+$2}; [ -n "$SUFIX" ] && shift ;;
    -- ) shift; break ;;
    * ) break ;;
  esac
  OPTS_PERL+=" ${opt:+-$opt}";
  shift;
done
: '
echo
echo "[$OPTS]"
echo "{$@}"
echo Verbose=${Verbose}
echo OverWrite=${OverWrite}
echo Delete=${Delete}
echo OneLine=${OneLine}
echo silence=${silence}
echo Sorted=${Sorted}
echo InPlace=${InPlace}
echo
'


_main "${@%%--}"
#####################################################################################################################
