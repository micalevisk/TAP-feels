> © 2016 Micael Levi L. C. - All Rights Reserved. <br>
[bit.ly/colabhack](https://gist.github.com/micalevisk/88dbc2dc998c8a588e73dad579331f6f)

## to inject ![](http://icons.iconarchive.com/icons/carlosjj/mozilla/24/Firefox-icon.png)

``` javascript
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://rawgit.com/micalevisk/TAP_feelings/master/gist/questoesColab.js';
document.head.appendChild(script);
```

**with [JSON for jQuery](http://mg.to/2006/01/25/json-for-jquery)**
## (fixed) for Google Chrome or Internet Edge: [RawGit](http://rawgit.com/) ![Chrome](http://icons.iconarchive.com/icons/appicns/simplified-app/24/appicns-Chrome-icon.png) ![IE10](http://icons.iconarchive.com/icons/dakirby309/windows-8-metro/24/Web-Browsers-Internet-Explorer-10-Metro-icon.png)

``` javascript
var code = '<script type="text/javascript" src="https://rawgit.com/micalevisk/TAP_feelings/master/gist/questoesColab.js"></script>';
$('head').append(code);
```
PS: erro no botão de esconder/mostrar corretas no Chrome.

_[link-and-execute-external-javascript-file-hosted-on-github](http://stackoverflow.com/questions/17341122/link-and-execute-external-javascript-file-hosted-on-github)_

--------------------------------------------------------------------------------------------------------------

### § FIXME
- [ ] identificar somente os diagramas UML que contém algum código válido
> ~~~js
> $('#uml-2').find('tr:nth-child(3)').children()
> ~~~

- [ ] Corrigir parse de HTML da tabela UML para código
- [ ] Atualizar cor no dialog quando for atualizar o status da questão (otimizar para nao precisar do **.each**)
- [ ] Remover funções inativas

### § TODO
- [ ] Parse UML com highlight syntax Java
- [ ] Parse UML passível de edição
- [ ] Parse UML com botão para baixar o arquivo (editado)
- [ ] Auto minimizar a questão quando status mudar para right
- [ ] Documentar todoas as funções
> ~~~js
> $('.file-status').change(function(){ console.log( $(this).attr("status") ) })
> ~~~

- [ ] Alterar o click do botão que vai para questão, por um href com o id da questão
> http://stackoverflow.com/questions/179713/how-to-change-the-href-for-a-hyperlink-using-jquery

> ~~~js
> $('.question-title').each(function(index){ questoes += "<a href='#question4' class='titulo-questoes' id='"+index+"'>" > +$(this).text()+ "<br></a>"; });
> ~~~

- [ ] Marcar/desmarcar texto selecionado (nas questões);
> http://mir3z.github.io/texthighlighter/ </br>
> http://www.michaelpstone.net/development/jquery/highlight-and-capture-text-using-jquery/ </br>
> https://www.sitepoint.com/10-jquery-text-highlighter-plugins/ </br>

- [ ] Adicionar efeito "+X pontos", onde X corresponde aos pontos ganhos na questão enviada, que aparece e desaparece rapidamente (com **.show.fadeOut(1000)**)
> https://api.jquery.com/select/

- [ ] Adicionar "teclas de atalho" ao pressionar o Alt (ou, _meta key_ = M), para ativar os botões criados.
- [ ] Criar função inicializadora de estados; criar função que salva a configuração atual num arquivo .xml ou .json (vide scrub_ajax/); importar configurações de um arquivo local.
