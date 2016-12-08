//Required for the clipboard to work on non-IE browsers. MAKE SURE PATH POINTS TO clipboard.swf
// dp.SyntaxHighlighter.ClipboardSwf = './js/clipboard.swf';

//Highlights the code and write the resulting html out to result textarea.
function staticallyConvertCode(codigoTexto, nomeDoArquivo)
{

        if(!codigoTexto || !nomeDoArquivo) return;

        //The classname of the highlighted code element
        var highlightedClassName = "dp-highlighter";

        //First we need to extract all option values and correctly construct
        //syntax highlighter's class string, which defines the options.
        var classString = "";

        /////////////// DEFAULTS //////////////
        classString += "java"
        firstline = 1;
        dp.SyntaxHighlighter.BloggerMode(true);
        ///////////////////////////////////////

        //Secondly, we need to extract the source code to be converted convert and convert it.

        //Extract the source code to be converted.
        //Escape the ampersand character and less-than character so that they will display correctly in
        //the textarea.  If the less-than character is not escaped, then the textarea might be prematurely
        //closed.  If the ampersand character is not escaped, then '&lt;' in the source code will be replaced
        //by the less-than character when displayed via the view plain command.
        // var originalCode = document.sourcecodeform.sourcecode.value.replace(/&/g,'&amp;').replace(/</g,'&lt;'); ////// <<<<<<<<<< o código, como string, gerado pelo getUMLText
        var originalCode = codigoTexto.replace(/&/g,'&amp;').replace(/</g,'&lt;');

        //Reset the current pre code area
        document.getElementById('codearea').innerHTML = "<pre name=\"code\" class=\""+classString+"\"></pre>";

        //Set the code div with the converted original code.  This is what the syntax highlighter will highlight.
        document.getElementsByName('code')[0].innerHTML = originalCode;

        //Highlight the code in the <pre> code div.
        dp.SyntaxHighlighter.HighlightAll('code');

        //Thirdly, we need to inject the header to the highlighted code if neccessary.
        // header = document.sourcecodeform.header.value; ////// <<<<<<<<<< nome do arquivo .java
        header = nomeDoArquivo;
        el = getCodeElement('\\btools\\b');
        // el.innerHTML = "<div class=\"header\">"+header+"</div>" + el.innerHTML;
        el.innerHTML = `<div class=\"header\">${header}</div>${el.innerHTML}`;

        //Fourthly, we need to inject the original source code so the menu items will work on a different page.

        //Get the resulting highlighted code element
        highlightedElement = getCodeElement('\\bdp-highlighter\\b');

        //Add a hidden textarea containing the original source code to the
        //prettied code so that the menu buttons will work later.
        highlightedElement.innerHTML += "<textarea style='display:none;' class='originalCode'>"+originalCode+"</textarea>";

        //Finally, we need to extract the highlighted code html source and write it to the results box
        // document.getElementById('result').value = "<div class=\""+highlightedClassName+"\">" + highlightedElement.innerHTML + "</div>";
        var codigoConvertido = `<div class=\"${highlightedClassName}\">${highlightedElement.innerHTML}</div>`; ////// <<<<<<<<<< o resultado HTML do código
        document.getElementById('result').value = codigoConvertido;

        // console.info(codigoConvertido);
        return codigoConvertido;
}


//Gets a subelement of the codearea node whose classname matched the test parameter
function getCodeElement(test)
{
        const idAreaDoCodigo = 'codearea'

        var node = document.getElementById(idAreaDoCodigo);
        var a = [];
        var re = new RegExp(test);
        var els = node.getElementsByTagName("*");

        for(var i=0,j=els.length; i<j; i++)
                if(re.test(els[i].className))
                        return els[i];
}




String.prototype.isEmpty = function() {
    return !(this.trim());
}
