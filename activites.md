---
title: visualisation de relations lexicales entre activités littéraires
lang: fr
csquotes: true
---

On conçoit souvent la littérature comme un _corpus_. C'est la définition qu'on trouve sur [Wikipedia](https://fr.wikipedia.org/wiki/Littérature):

> La __littérature__ est l'ensemble des oeuvres écrites ou orales auxquelles on reconnaît une valeur esthétique

On peut préférer la considérer comme une activité[^1], ou plus exactement, comme "un réseau d'activité[@becker2013a, p.81. La citation de Becker n'est pas spécifique à la littérature et concerne n'importe que "monde de l'art".]": _lire_, _traduire_, _écrire_, mais aussi _acheter_, _recommander_, _corriger_, _commenter_, etc.

Dans ce dépôt, je vais explorer ces activités, leurs proximités et leurs relations sur la base de l'analyse lexicale d'un corpus de textes que j'ai constitué et annoté dans le cadre de mon mémoire de master: les fils de discussions publiquement accessibles du forum [Jeunes Écrivain·es](https://www.jeunesecrivains.com/), un forum d'entraide consacré à la littérature.

Le corpus est constitué de 133040 messages (_posts_) répartis dans 6118 fils de discussions (_topics_).
L'annotation a été réalisée en utilisant [spaCy](https://spacy.io/), une libraire (python) d'analyse du langage naturel (_NLP_). __spaCy__ propose des modèles d'analyses pour le français mais ceux-ci n'étant pas adaptés à mon corpus (en fait, à mon avis, assez peu adapté à n'importe quel corpus[^spacy_fr]), j'ai écris plusieurs modules (et entraîné quelques modèles) permettant de réaliser les différentes tâches nécessaires à l'annotation de textes: un [_tokenizer_](https://github.com/thjbdvlt/quelquhui), un [_normalizer_](https://github.com/thjbdvlt/presque), un [_morphologizer_](https://github.com/thjbdvlt/turlututu), un [_lemmatizer_](https://github.com/thjbdvlt/viceverser) et un [_dependency parser_](https://github.com/thjbdvlt/french-dependency-parser) qui reposent, pour certains sur des [_word vectors_](https://github.com/thjbdvlt/french-word-vectors). Je ne rentre pas dans les détails de ces opérations, qui sont décrites [plus bas](#annotation), au besoin.

Le corpus est stocké sous la forme d'une base de données [Postgresql](https://www.postgresql.org/) dans un schéma qui implémente un modèle [EAV](https://en.wikipedia.org/wiki/Entity–attribute–value_model) hybride et que j'ai conçu pour l'analyse de textes en français (le code et la documentation du schéma sont disponibles [ici](https://github.com/thjbdvlt/litteralement)).
Les données utilisées dans les visualisations qui vont suivre ont (plus ou moins simplement) été récupérées de cette base de données _via_ des courts scripts SQL disponibles dans le dossier [sql](./sql).

# deux tableaux

Quelles sont donc ces activités littéraires, et quelles sont leurs relations?

Parmi les première activités littéraires auxquelles on est susceptible de penser il y a, il me semble, _lire_ et _écrire_. Une première manière, très simple, d'explorer les relations qu'ont d'autres activités avec celle-ci est de regarder les cooccurrences les plus fréquentes. Les tableaux suivants montrent verbes qu'on retrouve le plus souvent dans une même phrase que les verbes _lire_ ou _écrire_?

<p id="plire"></p>

<table id="lire"></table>

<table id="ecrire"></table>

{...}

ce réseau d'activité est aussi, naturellement, un réseau de personnes (ou plutôt d'acteur·rices). c'est, pour reprendre la terminologie du sociologue Howard Becker, un _monde_ (un "monde de l'art[@becker2017]").

[^1]: voir, par exemple, les textes de Florent Coste[@coste2017a], ou dans une certaine mesure de Jérôme Meizoz [@meizoz2016]. le deuxième paragraphe de l'article Wikipedia "Littérature" ajoute à la définition de la littérature comme corpus la définition de la littérature comme activité (mais uniquement comme activité de _création_, excluant donc par exemple la lecture); au reste, cette définition n'est pas la définition que donne l'article, mais uniquement une précision sur l'évolution de la notion de littérature.

[^spacy_fr]: Les modèles proposés par __spaCy__ pour le français ont été entraînés sur des données extrêmement incomplètes. Un mot, entre autre, y est par exemple totalement absent (et est toujours systématiquement annoté de façon aléatoire): le pronom _tu_ (le corpus d'entraînement est uniquement constitué de textes issus de la presse écrite).

<script src="./composition-roles.js"></script>

# annotation

L'annotation de texte avec __spaCy__ se fait en définissant une _pipeline_, une succession de fonction appliqué à un [document](https://spacy.io/api/doc). Un document est une liste de mots et des informations les concernant: leur nature grammaticale (_part-of-speech_ -- par exemple "verbe"), leur position dans le texte, leur noyau (_head_), leur fonction (_dependency_ -- par exemple "sujet"), leur lemme (_lemma_ -- le mot infléchi, par exemple "être" pour "êtes"), etc.

- Au tout début de cette _pipeline_ se trouve une opération qui peut sembler assez simple mais est en réalité assez délicate: la _tokenization_, le découpage d'une chaîne de caractère (texte) en _tokens_ (mots, ponctuation, etc.). Si un texte comme "cette partie est merveilleuse." est facile à réaliser, il en va déjà autrement pour un texte comme "les étudiant.e.s s'informent auprès de A. pour le(s) dossier(s).". Les modèles proposés par __spaCy__ ne parviennent pas à correctement découper un texte comme celui-ci, parce que les parenthèses 'intra-mots' ("dossier(s)") seront toujours séparées du mot lui-même, produisant un _token_ isolé ("s") qui sera alors analysé comme un pronom réflexif ("se", "s'"). Par ailleurs, ils ne parviennent pas à correctement découper les différentes formes d'écriture inclusive, et ont un comportement aléatoire en ce qui concerne les traits d'unions. J'ai donc écrit un _tokenizer_, [quelquhui](https://github.com/thjbdvlt/quelquhui), pour réaliser cette tâche.
- Comme beaucoup de textes, les textes de mon corpus contiennent des formes dysorthographiques ("vous etes") et des variations typographiques ("J'AAAARRIIIVVVE"). Pour pouvoir analyser correctement le sens de ces expressions, j'ai écrit un _normalizer_, [presque](https://github.com/thjbdvlt/presque) qui ramène ces expressions vers leurs forme canoniques ("vous êtes", "j'arrive"). Cette opération ne modifie pas le texte, mais assigne à valeur à la propriété `norm` de chaque _token_. Toutes les opérations suivantes feront la même chose: assigner, pour chaque _token_ une valeur à une propriété.
- Le _morphologizer_ [turlututu](https://github.com/thjbdvlt/turlututu) assigne les _part-of-speech_ ("noun", "verb", "adj", ...) et les caractéristiques _morphologies_ ("Number", "Tense", "Person", etc.) au format FEATS. Il s'agit d'un modèle neuronal entraîné sur un corpus que j'ai annoté de façon semi-automatique.
- Le _lemmatizer_ [viceverser](https://github.com/thjbdvlt/viceverser) détermine les _lemmes_, les formes non-fléchies des mots ("parcourir" pour "parcourions") en utilisant un lexique au format [Hunspell](http://hunspell.github.io/) (un programme de correction orthographique et de d'analyse morphologique) que j'ai fabriqué à partir des fichiers du logiciel [Grammalecte](https://grammalecte.net/) et qui est disponible [ici](https://github.com/thjbdvlt/spell-fr.vim) (il s'agissait à la base, pour moi, de réaliser un correcteur orthographique pour l'éditeur de texte [Vim](https://www.vim.org/) qui soit décent pour le français).
- Le _parser_ [french-dependency-parser](https://github.com/thjbdvlt/french-dependency-parser) effectue le _syntactic dependency parsing_: l'analyse des relations syntaxiques entre les mots et assigne des valeurs à deux propriétés: `head` (le noyau du mot) et `dep` (la fonction syntaxique relative au noyau).

Une partie de l'efficacité des modèles statistiques (_morphologizer_ et _parser_) repose sur l'usage de _word vectors_ de bonne qualité. Ceux que j'ai entraînés et qui sont disponibles [ici](https://github.com/thjbdvlt/french-word-vectors) ont été entraînés sur un corpus d'environ 500M de _tokens_ que j'ai obtenu par l'aggrégation de _corpora_ linguistiques sous licence [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr) provenant notamment de [Ortolang](https://www.ortolang.fr/), mais aussi de romans (traductions de Jack London, par exemple), de textes de sciences humaines dans le domaine public (Weil, Wittgenstein, Mauss, entre autres choses) et de romans contemporains sous licence compatible avec la [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr). La lemmatisation et la normalisation du _corpus_ a été réalisé avec __spaCy__ et l'entraînement avec [Gensim](https://radimrehurek.com/gensim/) avec l'algorithme [Word2Vec](https://radimrehurek.com/gensim/models/word2vec.html) (CBOW).

# bibliographie
