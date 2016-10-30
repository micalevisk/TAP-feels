*~ explanations coming soon*



# download my [constructor method generator](https://github.com/micalevisk/TAP_feelings) v1.28-0 (JAVA)

> using Shell, Perl and Sed*

``` bash
wget https://raw.githubusercontent.com/micalevisk/TAP_feelings/master/construtor.sh
wget https://raw.githubusercontent.com/micalevisk/TAP_feelings/master/constructorGenerator.pl
wget https://raw.githubusercontent.com/micalevisk/TAP_feelings/master/removerComentarios.sed
mkdir programaConstrutor;
mv constructorGenerator.pl removerComentarios.sed construtor.sh programaConstrutor/ ;
cd programaConstrutor/ ;  chmod +x *.sh
```

_O código deve possuir uma linha comentada com a tag "@attN", onde "N" é quantidade de atributos (declarados um por linha, abaixo desta)_
## execute:
``` bash
./construtor.sh -d -i <File.java>
```


[emojis](http://www.webpagefx.com/tools/emoji-cheat-sheet/)
