faire lire
==========

Explorer, à l'aide de la librairie [d3.js](https://d3js.org/), les données issues d'un forum d'entraide consacré à la littérature, et essayer de voir ce que ces données peuvent apporter à une conception de la littérature comme _réseau d'activités_.

contexte
--------

Ce dépôt présente un travail réalisé dans le cadre d'un enseignement dispensé à l'université de Lausanne par Isaac Pante et intitulé [_Visualisation de données_](https://github.com/ipante/ressources_visualisation_de_donnees).

usage
-----

Pour voir (et interagir) avec les visualisations, il faut utiliser un _server live_. On pourra en installer un comme ceci:

```bash
nmp install -g live-server
```

La page principale est le fichier `home.html`, c'est donc lui qu'il faut ouvrir dans le `live-server`.

```bash
git clone https://github.com/thjbdvlt/faire-lire
cd faire-lire

live-server --entry-file=home.html --browser=firefox
```

documentation
-------------

La documentation (qui porte sur la production des données et des visualisations) est intégrée aux fichiers HTML.

Les fichiers HTML eux-mêmes ont été générés à l'aide de [Pandoc](https://pandoc.org/) à partir de fichier Markdown, d'un [template](./pandoc/template.html) HTML et d'une bibliographie au format CSL-JSON, qui sont également dans le dépôt.

navigateur
----------

(Le dépôt a été conçu en utilisant le navigateur [Firefox](https://www.mozilla.org/en-US/firefox/115.0/releasenotes/) (version `115.14.0esr`).)
