/**
*	Funcoes para obtencao de informacoes sobre o (seu) banco de questoes do colabweb (T.A.P.).
*	@author Micael Levi L. C.
*	@update 10-29-2016, 21:01 (GTM-0400)
*	@use Acessar as ferramentas de desenvolvedor (F12), ir para a aba Console e inserir o codigo abaixo.
*	
*
*	status()          		=> retorna a quantidade de questoes resolvidas, erradas e indefindas.
* status.show()         => (cria e) insere retorno da funcao 'status' na barra de informacoes.
*	corretas()			  	  => retorna o titulo das questoes corrigidas.
*	erradas()				      => retorna o titulo das questoes erradas.
*	pendentes()				    => retorna o titulo das questoes pendentes (nao enviadas ou erradas).
* tituloQuestoes()	    => retorna o titulo de todas as questões (com o nome do arquivo/classe se o arguemento for 1 ou true).
* tituloQuestoes.save() => salva em um arquivo (e nao mostra no console) de nome 'tituloQuestoes-hhmm.txt'.
* arquivosDasQuestoes()	=> retorna os nomes dos arquivos de cada questao.
* nota()                => retorna a sua nota atual.
* toggleBar()           => altera a transparencia da barra de informacoes (menos/mais visivel, com transparencia 0.5).
* toggleBar.opacity()   => altera a transparencia padrao da barra de informacoes.
* maximizarStatus()     => maximiza as questoes com o status passado.
* minimizarStatus()     => minimiza as questoes com o status passado.
*
* atividade             => variavel que contem o titulo da atividade.
* qtd                   => variavel que contem a quantidade de questoes.
**/

// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_Expressions
// http://www.w3schools.com/jsref/jsref_obj_regexp.asp
// http://stackoverflow.com/questions/16792502/change-label-to-textbox-on-edit-hyperlink-click
// http://stackoverflow.com/questions/7635077/jquery-replace-input-button-onclick-event
// http://stackoverflow.com/questions/3893507/jquery-css-font-size
// http://stackoverflow.com/questions/203198/event-binding-on-dynamically-created-elements

// TODO: 
// verificar se o status está atualizando. []
// http://stackoverflow.com/questions/22897763/updating-variable-in-html-with-jquery
// http://stackoverflow.com/questions/28819815/updating-a-variable-when-input-changes-in-jquery

// TODO: 
// adiconar botões na barra (table row) para ativar as funções criadas. []
// http://www.w3schools.com/jsref/met_document_createelement.asp
// http://stackoverflow.com/questions/7707074/creating-dynamic-button-with-click-event-in-javascript
// http://stackoverflow.com/questions/8650975/javascript-to-create-a-button-with-onclick
// https://codepen.io/davidcochran/pen/WbWXoa
// http://www.w3schools.com/jsref/met_table_insertrow.asp





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
	// console.log(results);

	return results;
}
(function(status){
	status.show = function(naoMostrar){
		
		// retorna true se acabou de criar.
		if( createBar('info-status', 'info-grade-line', 'info-more') ){
// 			document.getElementById('info-status').setAttribute("style", "text-align: center");
// 	    document.getElementById('info-status').setAttribute("colspan",5);
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
	// console.log(results);
	
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
	// console.log(results);
	
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
	// console.log(results);
	
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
	// console.log(results);
	
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
		var	filename = atividade.replace(/oratório/, "").replace(/ /g,"") + sufix;

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
})(tituloQuestoes)



function arquivosDasQuestoes(){
	var results="";
	for(var i=0; i < qtd; ++i)
		results += document.getElementsByClassName("file")[i].getAttribute("file") + "\n";
	// console.log(results);
	
	return results;
}



function nota(){
	return document.getElementById("grade").innerHTML;
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
	// 		var newCell  = newRow.insertCell(0);
	// 		newCell.id = dataid;
	// 		newCell.className = classe;
	
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
	var button = document.createElement("button");
	button.style.cursor = 'pointer';
	button.id = id;
	button.innerHTML = title;
	button.onclick = func;
	element.appendChild(button);
}


// estado = {"right", "wrong", "indefined"}
function maximizarStatus(estado){
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

function minimizarStatus(estado){
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
	createButton('btnToggleCorretas', "esconder corretas", barraGrande); // id,title,element,funcOnClick
	$('#btnToggleCorretas').attr('onclick', 'minimizarStatus("right")');
	
	$('#btnToggleCorretas').click( function(){
		var lblAtual = $(this).text();
		
		if( lblAtual.search("esconder") != -1 ){
			lblAtual = "mostrar";
			$('#btnToggleCorretas').attr('onclick', 'maximizarStatus("right")');
		} 
		else{
			lblAtual = "esconder";
			$('#btnToggleCorretas').attr('onclick', 'minimizarStatus("right")');
		}

		$(this).html( $(this).text().replace(/\w+/, lblAtual) );	
	});
	

});
