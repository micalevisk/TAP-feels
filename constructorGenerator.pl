use strict;
use warnings;
use Getopt::Std;
use 5.018;
use vars qw($VERSION %DETAILS);
local $SIG{__WARN__} = sub { };  # Supress warnings.

$VERSION = "1.25-0";
%DETAILS=(
	author	=> 'Micael Levi',
	contact	=> 'mllc@icomp.ufam.edu.br',
	name	=> 'constructorGenerator',
	description	=> 'Imprime (STDOUT) um metodo construtor parametrizado, para codigos Java',
	url	=> 'http://github.com/micalevisk',
	changed	=> '10-24-2016'
);




################# [ GLOBAIS ] #################
my $BLUE="\033[36;1m";
my $RED="\033[40;31m";
my $YELLOW="\033[40;33m";
my $WHITE="\033[40;37;1m";
my $PURPLE="\033[0;35m";
my $NC="\033[m";

my $classe = "";# nome do construtor.
my @PARAMETROS = ();# parâmetros do construtor.
my @CORPO = ();# conteúdo do escopo do construtor.
my %MODIFICADORES_ACESSO = (0 => 'private', 1 => 'public', 2 => 'protected', 3 => 'default');
my $modificador = "";
my $identacao="\t\t";
###############################################

################# [ DEFAULT ] #################
my $delim=':';	# variableName${delim}typeVariable
my $quiet=0;		# não inserir o 'Auto-generated'
my $oneLine=0;	# a função terá apenas uma linha
my $acesso='1';
###############################################




###########################################################
############### [ LENDO E DEFININDO PÇÕES ] ###############
###########################################################
my %options=();
getopts('hqld:m:', \%options);

help(), if defined($options{h});

$delim		= $options{d}, if defined($options{d});
$quiet		= $options{q}, if defined($options{q});
$oneLine	= $options{l}, $identacao="\t", if defined($options{l});
$acesso		= $options{m}%(keys %MODIFICADORES_ACESSO), if defined($options{m});
###########################################################



####################################
###### VERIFICAÇÃO DA ENTRADA ######
####################################
my $nomeArquivo = $0; $nomeArquivo =~ s/^.\///;
my $nArgs = $#ARGV + 1;

if($nArgs < 2){
	showDetails();
	help();
}

my $argumentos = join("," ,@ARGV);
if( $argumentos !~ m/(\w+)(?:\.java)?,(.+)/i ){ help(); }


####################################
####### DEFININDO VARIÁVEIS  #######
####################################
$classe="$1";
@PARAMETROS=split(/,/, $2);

foreach (@PARAMETROS){
	if( $_ !~ m/^(\w+)$delim(\w+)$/ ){ next; }
	my $name = $1;
	my $type = $2;
	my $linha = "${identacao}this.$name = $name;";

	push(@CORPO, $linha);

	$_ =~ s/.*/$type $name/;
}


###################################################
############ IMPRESSÃO DO RESULTADO ###############
###################################################
# print "\tpublic";
print "\t";
print "$modificador " if defined( $modificador = $MODIFICADORES_ACESSO{$acesso} );
print "$classe(", join(", ", @PARAMETROS), ")"; ### prototipo.
if($oneLine){
	print "{";
	print "\n";
	print "\t// TODO Auto-generated constructor method.\n", if not $quiet;
	print join("", @CORPO);
}
else{
	print "{";
	print "\n";
	print "\t";
	print "\t// TODO Auto-generated constructor method.\n", if not $quiet;
	print join("\n", @CORPO);
	printf "\n";
}
print "\t";
print "}";
print "\n";




############################################
############## FUNÇÕES EXTRAS ##############
############################################

sub cor {
	return "$_[0]$_[1]$NC";
}

sub showDetails {
	# system "sed -n '/%DETAILS=/,/);/{/%DETAILS=/b; /);/q; p;}' $nomeArquivo";
	foreach my $key (sort (keys(%DETAILS))) { print cor($PURPLE, $key)," ",cor($WHITE, $DETAILS{$key}), "\n"; }
	# while( my( $key, $value ) = each %DETAILS ){ print "$key: $value\n";	}
}

sub help {
	print <<EOL;

	USO:
	====
	perl $BLUE$0$NC $YELLOW [-q | -l] [-d DELIMITER] [-m (0..3)]$NC $RED filename[.java] <var1Name>DELIMITER<var1Type> ...$NC

	EXEMPLO DE USO:
	===============
	\$ perl $0 -q Mestre.java nome:String anoNascimento:int afiliacao:String posto:String

	SAIDA:
	======
	public Mestre(String nome, int anoNascimento, String afiliacao, String posto){
	\tthis.nome = nome;
	\tthis.anoNascimento = anoNascimento;
	\tthis.afiliacao = afiliacao;
	\tthis.posto = posto;
	}

EOL
	exit 1;
}








q# ------------------------ NOTES ------------------------ #//q#
//
//	[constructorGenerator.pl]
//	Created by Micael Levi on 10/22/2016
//	Copyright (c) 2016 mllc@icomp.ufam.edu.br; All rights reserved.
//
#;
