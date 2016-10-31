> © 2016 Micael Levi L. C. - All Rights Reserved. <br>
[bit.ly/colabhack](https://gist.github.com/micalevisk/88dbc2dc998c8a588e73dad579331f6f)

## to inject ![](http://icons.iconarchive.com/icons/carlosjj/mozilla/24/Firefox-icon.png)

``` javascript
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://rawgit.com/micalevisk/88dbc2dc998c8a588e73dad579331f6f/raw/9258d8c99c8445b6cc6aa4f4adcfd0447f100567/questoesColab.js';
document.head.appendChild(script);
```

**with [JSON for jQuery](http://mg.to/2006/01/25/json-for-jquery)**
## (fixed) for Google Chrome or Internet Edge: [RawGit](http://rawgit.com/) ![](http://icons.iconarchive.com/icons/appicns/simplified-app/24/appicns-Chrome-icon.png) ![](http://icons.iconarchive.com/icons/dakirby309/windows-8-metro/24/Web-Browsers-Internet-Explorer-10-Metro-icon.png)

``` javascript
var code = '<script type="text/javascript" src="https://rawgit.com/micalevisk/88dbc2dc998c8a588e73dad579331f6f/raw/9258d8c99c8445b6cc6aa4f4adcfd0447f100567/questoesColab.js"></script>'; 
$('head').append(code);
```
PS: erro no botão de esconder/mostrar corretas no Chrome.

_[link-and-execute-external-javascript-file-hosted-on-github](http://stackoverflow.com/questions/17341122/link-and-execute-external-javascript-file-hosted-on-github)_
