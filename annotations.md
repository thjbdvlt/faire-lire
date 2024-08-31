---
title: annotations de textes avec spacy
lang: fr
csquotes: true
---

# annotation

L'annotation de texte avec __spaCy__ se fait en définissant une _pipeline_, une succession de fonction appliqué à un [document](https://spacy.io/api/doc). Un document est une liste de mots et des informations les concernant: leur nature grammaticale (_part-of-speech_ -- par exemple "verbe"), leur position dans le texte, leur noyau (_head_), leur fonction (_dependency_ -- par exemple "sujet"), leur lemme (_lemma_ -- le mot infléchi, par exemple "être" pour "êtes"), etc.

## tokenization

Au tout début de cette _pipeline_ se trouve une opération qui peut sembler assez simple mais est en réalité assez délicate: la _tokenization_, le découpage d'une chaîne de caractère (texte) en _tokens_ (mots, ponctuation, etc.). Si un texte comme "cette partie est merveilleuse." est facile à réaliser, il en va déjà autrement pour un texte comme "les étudiant.e.s s'informent auprès de A. pour le(s) dossier(s).". Les modèles proposés par __spaCy__ ne parviennent pas à correctement découper un texte comme celui-ci, parce que les parenthèses 'intra-mots' ("dossier(s)") seront toujours séparées du mot lui-même, produisant un _token_ isolé ("s") qui sera alors analysé comme un pronom réflexif ("se", "s'"). Par ailleurs, ils ne parviennent pas à correctement découper les différentes formes d'écriture inclusive, et ont un comportement aléatoire en ce qui concerne les traits d'unions. J'ai donc écrit un _tokenizer_, [quelquhui](https://github.com/thjbdvlt/quelquhui), pour réaliser cette tâche.

## normalization

Comme beaucoup de textes, les textes de mon corpus contiennent des formes dysorthographiques ("vous etes") et des variations typographiques ("J'AAAARRIIIVVVE"). Pour pouvoir analyser correctement le sens de ces expressions, j'ai écrit un _normalizer_, [presque](https://github.com/thjbdvlt/presque) qui ramène ces expressions vers leurs forme canoniques ("vous êtes", "j'arrive"). Cette opération ne modifie pas le texte, mais assigne à valeur à la propriété `norm` de chaque _token_. Toutes les opérations suivantes feront la même chose: assigner, pour chaque _token_ une valeur à une propriété.

## pos-tagging & morphological analysis

Le _morphologizer_ [turlututu](https://github.com/thjbdvlt/turlututu) assigne les _part-of-speech_ ("noun", "verb", "adj", ...) et les caractéristiques _morphologies_ ("Number", "Tense", "Person", etc.) au format FEATS. Il s'agit d'un modèle neuronal entraîné sur un corpus que j'ai annoté de façon semi-automatique.

## lemmatization

Le _lemmatizer_ [viceverser](https://github.com/thjbdvlt/viceverser) détermine les _lemmes_, les formes non-fléchies des mots ("parcourir" pour "parcourions") en utilisant un lexique au format [Hunspell](http://hunspell.github.io/) (un programme de correction orthographique et de d'analyse morphologique) que j'ai fabriqué à partir des fichiers du logiciel [Grammalecte](https://grammalecte.net/) et qui est disponible [ici](https://github.com/thjbdvlt/spell-fr.vim) (il s'agissait à la base, pour moi, de réaliser un correcteur orthographique pour l'éditeur de texte [Vim](https://www.vim.org/) qui soit décent pour le français).

## syntactic dependency parsing

Le _parser_ [french-dependency-parser](https://github.com/thjbdvlt/french-dependency-parser) effectue le _syntactic dependency parsing_: l'analyse des relations syntaxiques entre les mots et assigne des valeurs à deux propriétés: `head` (le noyau du mot) et `dep` (la fonction syntaxique relative au noyau).

## word vectors

Une partie de l'efficacité des modèles statistiques (_morphologizer_ et _parser_) repose sur l'usage de _word vectors_ de bonne qualité. Ceux que j'ai entraînés et qui sont disponibles [ici](https://github.com/thjbdvlt/french-word-vectors) ont été entraînés sur un corpus d'environ 500M de _tokens_ que j'ai obtenu par l'aggrégation de _corpora_ linguistiques sous licence [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr) provenant notamment de [Ortolang](https://www.ortolang.fr/), mais aussi de romans (traductions de Jack London, par exemple), de textes de sciences humaines dans le domaine public (Weil, Wittgenstein, Mauss, entre autres choses) et de romans contemporains sous licence compatible avec la [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr). La lemmatisation et la normalisation du corpus a été réalisé avec __spaCy__ et l'entraînement avec [Gensim](https://radimrehurek.com/gensim/) avec l'algorithme [Word2Vec](https://radimrehurek.com/gensim/models/word2vec.html) (CBOW).
