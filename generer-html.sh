#!/bin/bash

# génère le html à partir du fichier markdown à l'aide de pandoc
# https://pandoc.org/
# (le CSL pour le style de citation provient de l'archive zotero.)

d=./pandoc/

pandoc -i home.md -o home.html \
    --citeproc --bibliography=${d}bibliography.json \
    --csl=${d}unige-ll-fr-mod.csl \
    --standalone --css=css/style.css --template=${d}template.html \
    --html-q-tags=true

pandoc -i annotations.md -o annotations.html \
    --standalone --css=css/style.css --template=${d}template.html \
    --html-q-tags=true
