/**
*	Funcoes para obtencao de informacoes sobre o (seu) banco de questoes do colabweb (T.A.P.).
*	@author Micael Levi L. C.
*	@update 10-31-2016, 15:45 (GTM-0400)
*	@use Acessar as ferramentas de desenvolvedor (F12), ir para a aba Console e inserir o codigo abaixo.
*	
*
*	status()              => retorna a quantidade de questoes resolvidas, erradas e indefindas.
* 	status.show()         => (cria e) insere retorno da funcao 'status' na barra de informacoes.
*	corretas()	      => retorna o titulo das questoes corrigidas.
*	erradas()	      => retorna o titulo das questoes erradas.
*	pendentes()	      => retorna o titulo das questoes pendentes (nao enviadas ou erradas).
* 	tituloQuestoes()      => retorna o titulo de todas as questões (com o nome do arquivo/classe se o arguemento for 1 ou true).
* 	tituloQuestoes.save() => salva em um arquivo (e nao mostra no console) de nome 'tituloQuestoes-hhmm.txt'.
* 	arquivosDasQuestoes() => retorna os nomes dos arquivos de cada questao.
* 	nota()                => retorna a sua nota atual.
* 	toggleBar()           => altera a transparencia da barra de informacoes (menos/mais visivel, com transparencia 0.5).
* 	toggleBar.opacity()   => altera a transparencia padrao da barra de informacoes.
* 	maximizarStatus()     => maximiza as questoes com o status passado.
* 	minimizarStatus()     => minimiza as questoes com o status passado.
*
* 	atividade             => variavel que contem o titulo da atividade.
* 	qtd                   => variavel que contem a quantidade de questoes.
**/

// FIXME: 
// verificar se o status está atualizando. linha 340.

// TODO:
// função para obter toda a questão (para exportar futuramente, como pdf).
// $('#3').parents[0].textContent() retorna a questão 2 em forma de texto. OU $('#3').parent().text()
// $("div[id='0']") é a questão 1; .parent().text() é o conteúdo.


var DATA = document.getElementsByTagName("DIV")[6].getElementsByTagName("DIV")[1].getElementsByTagName("DIV")[0]; // o banco de questões.
var qtd = DATA.getElementsByClassName("question").length; // quantidade de questões.
var regexRemoveHtml = new RegExp("<[^>]*>","g"); //// ==  /<[^>]*>/g
var atividade = document.getElementsByClassName('preface-title')[0].innerHTML;




function status(retornarFormatado){
	var resolvidas=0;
	var erradas=0;
	var indefinidas=0;
	
	for(var i=0; i < qtd; i++){
		var questao = DATA.getElementsByClassName("question")[i];
		var status  = questao.getAttribute("status");
		if(status.localeCompare("right") == 0) resolvidas++;
		else if(status.localeCompare("wrong") == 0) erradas++;
		else indefinidas++;
	}
	
	var results = resolvidas + ':' + erradas + ':' + indefinidas; // resolvidas:erradas:indefinidas
	if(retornarFormatado) return results;
	results = results.replace(/(\d+):(\d+):(\d+)/, "$1 corretas(s)\n$2 errada(s)\n$3 não enviada(s)");
	
	resolvidas = resolvidas + " resolvida(s); ";
	erradas = erradas + " errada(s); ";
	indefinidas = indefinidas + " indefinida(s).";

	results = resolvidas + erradas + indefinidas;

	return results;
}
(function(status){
	status.show = function(naoMostrar){
		
		// retorna true se acabou de criar.
		if( createBar('info-status', 'info-grade-line', 'info-more') ){
// 			document.getElementById('info-status').setAttribute("style", "text-align: center");
// 	    		document.getElementById('info-status').setAttribute("colspan",5);
			$('#info-status').attr("colspan",5);
			$('#info-status').attr("style", "text-align: center");
			$('#info-status').css('font-size','12pt');
			$('#info-status').html('<span><nobr id="info-info-status"></nobr></span>');
		} 
		
		if(naoMostrar) $('#info-status').hide();
// 		if(naoMostrar) elem.style.display = 'none'; // oposto de 'inline'
		var info = status(1).replace(/(\d+):(\d+):(\d+)/, "$1 resolvidas, $2 erradas, $3 não enviadas.");
		$('#info-info-status').html(info); // .replaceAll(';','\n').replace('.','')
	}
})(status)




function corretas(){
	var results="";
	for(var i=0; i < qtd; i++){
		var questao = DATA.getElementsByClassName("question")[i];
		var status  = questao.getAttribute("status");
		if(status.localeCompare("right") == 0){
			var titulo = questao.getElementsByClassName("question-title")[0];
			results += titulo.innerHTML + "\n";
		}		
	}
	results = results.slice(0, -1).replace(regexRemoveHtml,"");
	
	return results;
}



function erradas(){
	var results="";
	for(var i=0; i < qtd; i++){
		var questao = DATA.getElementsByClassName("question")[i];
		var status  = questao.getAttribute("status");
		if(status.localeCompare("wrong") == 0){
			var titulo = questao.getElementsByClassName("question-title")[0].innerHTML;
			var pontos = '(' + questao.getElementsByClassName("question-grade")[0].innerHTML + ')';
			var erro = "ERRO:" + '[' + questao.getElementsByClassName("file-status")[0].innerHTML + ']';

			results += addAspas(titulo) + ' ' + erro + ' ' + pontos + "\n";
		}		
	}
	results = results.slice(0, -1).replace(regexRemoveHtml,"");
	
	return results.slice(1, -1);
}



function pendentes(){
	var results="";
	for(var i=0; i < qtd; i++){
		var questao = DATA.getElementsByClassName("question")[i];
		var status  = questao.getAttribute("status");
		if(status.localeCompare("undefined") == 0 || status.localeCompare("wrong") == 0){
			var titulo = questao.getElementsByClassName("question-title")[0].innerHTML;
			var pontos = '(' + questao.getElementsByClassName("question-grade")[0].innerHTML + ')';
			results += addAspas(titulo) + ' ' + pontos + "\n";
		}		
	}
	results = results.slice(0, -1).replace(regexRemoveHtml,"");
	
	return results;
}



function tituloQuestoes(mostrarNumero, mostrarArquivo){
	var results="";
	
	for(var i=0; i < qtd; i++){
		var questao = DATA.getElementsByClassName("question")[i];
		var status  = questao.getAttribute("status");
		var titulo = questao.getElementsByClassName("question-title")[0].innerHTML;
		// var numeroQuestao = titulo.replace(/^[^\d]*(\d+).*/,"$1"); /// ou 'i'
		var nomeArquivo = questao.getElementsByClassName("file")[0].getAttribute("file"); // .replace(/\.java/,"")
	
		if(mostrarNumero) 
			titulo = titulo.replace(/Quest[^\d]*\s*(\d+)\s*[^\w]\s*(.*)/i, replacer);
		else
			titulo = titulo.replace(/Quest[^\d]*\s*\d+\s*[^\w]\s*(.*)/i, "$1");

		titulo = addAspas(titulo);
		if(mostrarArquivo) titulo += " - " + nomeArquivo;

		results += titulo + "\n";
	}
	
	results = results.slice(0, -1).replace(regexRemoveHtml,"");
	
	return results;
}
(function(tituloQuestoes){
	tituloQuestoes.save = function(mostrarNumero, mostrarArquivo){
		var data = tituloQuestoes(mostrarNumero, mostrarArquivo)

		if(!data){
			console.error('tituloQuestoes.save: Nenhum dado foi retornado.')
			return;
		}
    
		var date = new Date();
		var sufix = "-" + date.getHours() + date.getMinutes() + ".txt"
		var filename = atividade.replace(/oratório/, "").replace(/ /g,"") + sufix;

		if(typeof data === "object"){
			data = JSON.stringify(data, undefined, 4)
		}

		var blob = new Blob([data], {type: 'text/json'}),
				e    = document.createEvent('MouseEvents'),
				a    = document.createElement('a')

		a.download = filename
		a.href = window.URL.createObjectURL(blob)
		a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')

		e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
		a.dispatchEvent(e)
	}
})(tituloQuestoes)



function arquivosDasQuestoes(){
	var results="";
	for(var i=0; i < qtd; ++i)
		results += document.getElementsByClassName("file")[i].getAttribute("file") + "\n";
	
	return results;
}



function toggleBar(){
// 	var tableRef = document.getElementById('info-info').getElementsByTagName('tbody')[0];
	/*
	var data = $('.table-noborder').not('#info');
	if( data.is(":visible") ) data.hide();
	else data.show();
	*/
	
	if(document.getElementById('grade-skills') == null){
		var styleBar = document.createElement('style');
		styleBar.type = 'text/css';
		styleBar.id = 'grade-skills';
		styleBar.innerHTML = '.info-grade-skills { opacity: 0.5; }';
		document.head.appendChild(styleBar);
		// document.getElementsByTagName('head')[0].appendChild(styleBar);
	}

	var data = $('.info-grade-line');
	if(data.hasClass('info-grade-skills')) data.removeClass('info-grade-skills');
	else data.addClass('info-grade-skills');
	// if(data.css("opacity") != 1) data.removeClass('info-grade-skills');
	// else data.addClass('info-grade-skills');
	
	return styleBar;
}
(function(toggleBar){
	toggleBar.opacity = function(value){
		var element = document.getElementById('grade-skills');
		if(element == null) element = toggleBar();
		element.innerHTML = ".info-grade-skills { opacity: "+ value +"; }";
	}
})(toggleBar)





// ========================= [ AUXILIARES ] ========================= //
function addAspas(str){
	return str.replace(/^(.*)$/, "\"$1\"");
}


// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/replace
function replacer(match, number, title){
	return [number, title].join('_'); // => q_titulo da questao de numero q
}


// cria um table row e insere um table data com o id passado.
function createBar(dataid, classe, rowid){
	if(document.getElementById(dataid) != null) return false; // nao eh necessario criar
	var tableRef = document.getElementById('info-info').getElementsByTagName('tbody')[0];
	var newRow   = tableRef.insertRow(tableRef.rows.length);
	newRow.id = rowid;
	appendBar(dataid, classe, rowid);
	
	return true;
}

// cria e insere um table data com o id x, na table row de id y na posicao final.
function appendBar(idx, classx, idy){
	var row =  document.getElementById(idy);
	var newCell = row.insertCell(row.cells.length);
	newCell.id = idx;
	newCell.className = classx;	
}


function createButton(id, title, element, func){
	if(document.getElementById(id) != null) return;
	var button = document.createElement("BUTTON");
	button.style.cursor = 'pointer';
	button.id = id;
  button.innerHTML = title;
	button.onclick = func;
	element.appendChild(button);
}


// estado = {"right", "wrong", "indefined"}
function maximizarStatus(estado, mostrar){
	
	if(mostrar){
		$('.question[status='+estado+']').show();
		return;
	}
	
	$('div[status='+estado+']').each(function() {
 
		$(this).find(".maximize").each(function() {
			parent = $(this).parent();
			$(this).remove();
			labHeight = $(parent).data("labHeight");
			$(parent).prepend("<div class='minimize'><img src='res/minimize.png'/></div>").animate( { height: labHeight }, 200, function() {
				$(this).css("height", "auto");
			});
     		});
		
	});
}

function minimizarStatus(estado, esconder){
	
	if(esconder){
		$('.question[status="'+estado+'"]').hide();
		return;
	}
	
	$('div[status='+estado+']').each(function() {

		$(this).find(".minimize").each(function(){
			 parent = $(this).parent();
			 $(this).remove();
			 labHeight = $(parent).height();
			 $(parent).data("labHeight", labHeight).prepend("<div class='maximize'><img src='res/maximize.png'/></div>").animate( { height:"30px" }, 200);
		});
		
	});
}






$(document).ready(function() {
	
	
	// ================================================================ //
  	document.getElementById('info-info-div').style.cursor = 'pointer';

	$('.info-grade-line').click( function(){
		var barraExtra = $('#info-status');
		status.show(); // atualizar dados.
		if( barraExtra.is(":visible") ) barraExtra.hide(100);
		else barraExtra.show(100);
	});

	// TESTAR:
	$('.file-status').change( function(){ 
		alert("ESTADO DO ARQUIVO alterado");
	});
	// ================================================================ //

	
	/************************* [ TESTE: BOTÕES NA BARRA ] *************************/
	status.show(1);
	var barraGrande = document.getElementsByClassName('banner-table-title')[0];
	createButton('btnToggleTransparencia', "toggle transparência", barraGrande, toggleBar); // id,title,element,funcOnClick
	// createBar('info-toggle', 'info-grade-line', 'info-plus'); // id,class
	// var barraPlus = document.getElementById('info-toggle');
	// createButton('btnToggle', "toggle", barraPlus, toggleBar); // id,title,element,funcOnClick
	createButton('btnToggleCorretas', "esconder corretas", barraGrande, ''); // id,title,element,funcOnClick
	$('#btnToggleCorretas').attr('onclick', 'minimizarStatus("right",false)');
	
	$('#btnToggleCorretas').click( 
		function(){
			// lblAtual  := button innerHTML name
			// max_min   := 'max' means maximizarStatus(), 'min' means minimizarStatus()
			
			lblAtual = $(this).text();
			
			if( lblAtual.search("esconder") != -1 ){
				lblAtual = "mostrar";
				max_min = "maximizar";
			} 
			else{
				lblAtual = "esconder";
				max_min = "minimizar";
			}
				
			funcNova = $('#btnToggleCorretas').attr("onclick").replace(/maximizar|minimizar/i, max_min);
			$('#btnToggleCorretas').attr("onclick", funcNova);

			$(this).html( $(this).text().replace(/\w+/, lblAtual) );	
	 }
	);
	
	
	////////////////////////////// CHECKBOX COM ID 'cbCorretas' //////////////////////////////
	var checador = null;
	if( (checador = document.getElementById('cbCorretas') ) == null)
	checador = document.createElement("INPUT");
	checador.type = "checkbox"; // checador.setAttribute("type", "checkbox"); 
	checador.id = "cbCorretas";
	checador.style.cursor = "pointer";
	barraGrande.appendChild(checador);
	$('#cbCorretas').change(function(){
		estaMarcado = $(this).is(":checked");
		funcaoNova = $('#btnToggleCorretas').attr("onclick").replace(/true|false/i, estaMarcado);
		$('#btnToggleCorretas').attr('onclick', funcaoNova);
	});


	
	$('.question-title').each(function(index){  $(this).attr("id", index); });
	////////////////////////////// DIALOG COM OS TÍTULO DAS QUESTOES //////////////////////////////
	var barraGrande = document.getElementsByClassName('banner-table-title')[0];

	var para = document.createElement("DIV");
	var questoes="";
	$('.question-title').each(function(index){ questoes += "<span class='titulo-questoes' id='"+index+"'>" +$(this).text()+ "<br></span>" ; });
	para.innerHTML = questoes;

	var dia = document.createElement("DIV");
	dia.title = atividade;
	dia.id = "dialog-message";
	dia.appendChild(para);
	document.head.appendChild(dia);

	createButton("opener", "questões", barraGrande);
	$('#opener').click(function() {
		$("#dialog-message").dialog({
			width: 500,
			maxWidth: 500,
			maxHeight: 400,
			modal: true,
			buttons: {
				Ok: function() {
					$(this).dialog( "close" );
				},
				Baixar: function() {
					questoes = $('.question-title').text().replace(/questão/ig, "\n$&").substring(1);
					if( sistemaOperacional().indexOf("Win") != -1 ) questoes = questoes.replace(/$/mg, '\r');
					console.save(questoes, atividade+'.txt');
				}
			}
		});
	});

	
	
	$('.titulo-questoes').each(function(){ 
		cor = "lightgray";
		qid = $(this).attr("id");
		
		statusDaQuestao = $('div[id="'+ qid +'"]').parent().attr("status").toLocaleLowerCase();
		if(statusDaQuestao == "right") cor = "green";
		else if(statusDaQuestao == "wrong") cor = "red";
		
		$(this).css("color", cor);
	});
	$('.titulo-questoes').css('cursor', 'pointer');
	
	// Ao clicar na questão X de id X-1, vá para o objeto $('.question')[X-1]; $("span[id='0']") é a questão 1; .text() é o seu título.
	$('.titulo-questoes').click(function(){
		qid = $(this).attr("id");
		$("#dialog-message").dialog("close");
		goTo(qid);
	});
	
  

	
	
});


/* //// [OLD BUT GOLD] ////
	$('.titulo-questoes').mouseover(function(){ 
		cor = "red";
		qid = $(this).attr("id");
		statusDaQuestao = $('#'+qid).parent().attr("status");
		
		if(statusDaQuestao.toLocaleLowerCase() == "right") cor = "green";
		$(this).css("color", cor);
	});
	$('.titulo-questoes').mouseout(function(){ $(this).css("color", "black"); });
*/




// (c) http://stackoverflow.com/questions/11849562/how-to-save-the-output-of-a-console-logobject-to-a-file
(function(console){
console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.saved'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }
})(console)


// (c) http://www.javascripter.net/faq/operatin.htm
// (c) http://stackoverflow.com/questions/7044944/jquery-javascript-to-detect-os-without-a-plugin
function sistemaOperacional(){
	/*
	var OSName="";
	if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
	if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
	if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
	if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
	return OSName;
	*/

	return navigator.platform; // {Win32, Linux x86_64, Mac}
}


// (c) http://stackoverflow.com/questions/13735912/anchor-jumping-by-using-javascript
// (c) http://stackoverflow.com/questions/6677035/jquery-scroll-to-element
function goTo(h){
	/*
	var top = document.getElementById(h).offsetTop; // = $('#'+h).offset().top;	
	window.scrollTo(0, top);
	*/
	$('html, body').animate({
    scrollTop: $('#'+h).offset().top
   }, 500);
}
