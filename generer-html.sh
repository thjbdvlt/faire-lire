#!/bin/bash

# génère le html à partir du fichier markdown à l'aide de pandoc
# https://pandoc.org/
# (le CSL pour le style de citation provient de l'archive zotero.)

pandoc -i activites.md -o activites.html \
    --citeproc --bibliography=./bibliography.json --csl=./unige-ll-fr-mod.csl \
    --standalone --css=./style.css --template=./template.html \
    --html-q-tags=true
