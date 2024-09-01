---
title: visualisation de relations lexicales entre activités littéraires
lang: fr
csquotes: true
---

On conçoit souvent la littérature comme un corpus. C'est la définition qu'on trouve sur [Wikipedia](https://fr.wikipedia.org/wiki/Littérature):

> La __littérature__ est l'ensemble des oeuvres écrites ou orales auxquelles on reconnaît une valeur esthétique

On peut préférer la considérer comme une activité[^1], ou plus exactement, comme "un réseau d'activité[@becker2013a, p.81. La citation de Becker n'est pas spécifique à la littérature et concerne n'importe que "monde de l'art".]" dans lequel se trouvent
_lire_, _écrire_, _traduire_, mais aussi _acheter_, _recommander_, _corriger_, _commenter_, etc.

Dans ce dépôt, je me propose d'explorer ces activités, leurs proximités et leurs relations sur la base de l'analyse lexicale d'un corpus de textes que j'ai constitué et annoté dans le cadre de mon mémoire de master: les fils de discussions publiquement accessibles du forum [Jeunes Écrivain·es](https://www.jeunesecrivains.com/), un forum d'entraide consacré à la littérature.

Le corpus est constitué de 133'040 messages (_posts_) répartis dans 6'118 fils de discussions (_topics_).
L'annotation a été réalisée en utilisant [spaCy](https://spacy.io/), une libraire (python) d'analyse du langage naturel (_NLP_). __spaCy__ propose des [modèles](https://spacy.io/models/fr) pour le français mais ceux-ci n'étant pas adaptés à mon corpus (en fait, à mon avis, assez peu adapté à n'importe quel corpus[^spacy_fr]), j'ai écrit plusieurs modules (et entraîné quelques modèles) permettant de réaliser les différentes tâches nécessaires à l'annotation de textes: un [_tokenizer_](https://github.com/thjbdvlt/quelquhui), un [_normalizer_](https://github.com/thjbdvlt/presque), un [_morphologizer_](https://github.com/thjbdvlt/turlututu), un [_lemmatizer_](https://github.com/thjbdvlt/viceverser) et un [_syntactic dependency parser_](https://github.com/thjbdvlt/french-dependency-parser) qui reposent, pour certains sur des [_word vectors_](https://github.com/thjbdvlt/french-word-vectors). Je ne rentre pas dans les détails de ces opérations (elles sont, au besoin, décrites [ici](./annotations.html)). Le corpus annoté représente un peu plus de 14M de mots (14'787'715).

Le corpus est stocké localement sous la forme d'une base de données [Postgresql](https://www.postgresql.org/) dans un schéma que j'ai conçu pour l'analyse de textes en français (une implémentation d'un modèle [EAV](https://en.wikipedia.org/wiki/Entity–attribute–value_model) hybride, dont le code et la documentation sont disponibles [ici](https://github.com/thjbdvlt/litteralement)). Les données utilisées dans les visualisations qui vont suivre ont donc simplement été récupérées de cette base de données _via_ des courts scripts SQL qu'on pourra au besoin consulter dans le dossier [sql](./sql).

<p class="info-donnees">La collecte des données s'est faite en respectant le fichier `robots.txt` (qui n'est pas spécifique à ce forum) et, évidemment, en ayant pris connaissances des [règles](https://www.jeunesecrivains.com/t56577-a-lire-les-regles-du-forum) du forum (rédigées par les membres _admins_ du forum) et de son [guide](https://www.jeunesecrivains.com/t59918-guide-pratique-d-utilisation-du-forum) d'utilisation. Seules les sections __publiques__ (accessibles sans identification) ont été collectées. C'est un principe éthique minimal du _web scraping_ et il est ici pertinent puisqu'environ la moitié des sections seulement est publique: les données accessibles publiquement le sont intentionnellement. J'ai tout de même exclu certaines sections publiques: la section _présentation_ (dans laquelle se présentent les membres du forum), celles qui concernent les interactions _IRL_ (organisation d'événements, etc.) et la section _constance_ qui propose des journaux d'écriture (pour éviter de collecter, précisément, ce qui s'apparente à des journaux personnels). Les données collectées ne sont pas distribuées: seules des visualisations et des fragments sont utilisées ici, qui ne permettent en aucune façon l'identification de personnes réelles.</p>

# deux tableaux

Quelles sont donc ces activités littéraires, et quelles sont leurs relations?

Parmi les premières activités littéraires auxquelles on est susceptible de penser il y a, il me semble, "lire" et "écrire". Une première manière, très simple, d'explorer les relations qu'ont d'autres activités avec celle-ci consiste à regarder les cooccurrences les plus fréquentes. Les tableaux suivants montrent les verbes qu'on retrouve le plus souvent dans une même phrase que les verbes "lire" ou "écrire". Ce sont les [lemmes](https://universaldependencies.org/u/overview/morphology.html#lemmas) qui sont pris en compte: "je lirai ce que tu as écrit" et "nous préférons lire qu'écrire" sont donc équivalents.

<div id="cooccurrence"></div>
<script src="./js/cooccurrence.js"></script>

Les premières lignes de chaque tableau peuvent sembler assez insignifiantes: le verbe le plus fréquemment employé dans une même phrase que "lire" est... "lire" ("j'ai lu Wittgenstein avant de lire Weil"); idem pour écrire. Le second est "écrire" ("lire et écrire"). Les lignes qui suivent montrent des verbes qui sont tout simplement très fréquents en français (dans le tableau, les cooccurrences ne sont pas relatives mais absolues): "savoir", "aimer", "mettre", "prendre", etc. Pourtant, il y a des variations: "savoir", "trouver", "prendre" sont aux mêmes positions pour "lire" et "écrire", mais les positions de "aimer" et "penser" sont inversées.

La position de "commencer" est aussi très différente dans les deux tableaux: "commencer à écrire" est beaucoup plus fréquent que "commencer à lire". On peut, je crois, sans mal le comprendre, car écrire un roman (la forme dominante sur le forum) prend bien davantage de temps que le lire (plus un processus est long, et plus il apparait naturel de dire qu'on l'a "commencé": on dit souvent "j'ai commencé une série" mais plus rarement "j'ai commencé un morceau de musique", etc.). Plus probablement encore, cela fait référence au début, non de l'écriture de telle ou telle texte (début d'un processus ou d'un projet), mais de l'écriture comme activité. Certaines variations sont moins liées au sens d'un mot qu'à des locutions particulières. Ainsi, "donner" est beaucoup plus fréquent avec "lire" qu'avec "écrire" probablement en raison de l'expression "donner à lire".

Presque tout en bas de ces tableaux on trouve "publier". C'est le premier verbe semble vraiment en lien direct avec "lire" et "écrire". Sur le forum, il y a en effet beaucoup de discussions consacrées à la publication, mais il y en a encore beaucoup plus consacrées au processus d'écriture lui-même, au sujet duquel on demande des conseils. Or, "publier" a peu de synonyme (tout au plus "éditer"), contrairement, par exemple, à "conseiller" (suggérer, recommander, proposer, etc.). C'est là un des inconvénients à travailler avec des simples cooccurrences. Un autre inconvénient, c'est l'importance, évoquée plus haut, que prennent les verbes qui sont tout simplement très fréquents (mais comme solution à cela, il y a la pondération par la fréquence totale). Au reste, on ne voit pas vraiment ici des "activités" littéraires.

# _word embeddings_

Une solution alternative qui ne pose pas ces mêmes problèmes, ou pas tous (qui en pose bien sûr d'autres) et l'utilisation de [_word embeddings_](https://en.wikipedia.org/wiki/Word_embedding) ou _word vectors_. Les _word embeddings_ représentent les mots comme des vecteurs à _n_ dimensions (ceux que j'ai entraînés ont 100 dimensions, d'autres en ont beaucoup plus). Pour la suite, par simplification, j'en parlerai comme des points[^point] dans des espaces (à _n_ dimensions).
Plus un mot (un point) est proche d'un autre et plus il en est __sémantiquement__ proche. Ou plutôt, d'un point de vue algorithmique: plus il a tendance à être utilisé dans des contextes similaires. Selon une conception figurative (représentationnelle) du langage, cela n'a rien à voir avec "être sémantiquement proche". Mais si l'on adopte une perspective wittgensteinienne sur le langage, cette idée n'est pas sans fondement. Selon Wittgenstein, la signification d'un mot est moins définie par une "chose" à laquelle ce mot ferait référence ou à un "concept" qu'il contiendrait qu'aux "jeux de langage[@wittgenstein2014]" qui le mobilisent: "la signification d'un mot c'est l'usage de ce mot[@wittgenstein2014]". La signification du mot "bonjour" n'est pas autre chose que le genre de situation dans lesquels on utilise ce mot (qui ne fait pas vraiment "référence" à quoi que ce soit[@wittgenstein2014]). "Vrai" et "faux" sont sémantiquement très proches parce qu'on réalise avec eux le même genre d'actions dans le même genre de situations. Wittgenstein dirait: leurs "grammaires" sont similaires. Leurs _word embeddings_ seraient par conséquent très proches (et le sont souvent).

[^point]: En fait, ne s'agit bien sûr pas de _point_ mais de _vecteur_; mais parler de _points_ aide à mon avis à se représenter les _word vectors_ dont les _forces_ sont à peu près (il me semble) équivalentes aux _coordonnées_ des _points_.

Une représentation minimale d'un tout petit modèle de _word embeddings_ pourrait ressembler à ceci:

```txt
lire    [ 0.3, -0.2,   -1,  0.1]
écrire  [ 0.1, -0.4,    1, -0.7]
parler  [-0.4,  0.1, -0.4,    1]
```

Les dimensions (les axes géométriques) ne correspondent pas à une chose tangible, mais on pourrait se les représenter comme des axes sémantiques ou contextuels: la première dimension pourrait être la dimension _négative_-_positive_, la deuxième dimension serait la dimension _active_-_passive_, la troisième dimension serait la dimension _familière_-_soutenue_, etc. On pourrait alors imaginer que les _word embeddings_ de "vrai" et de "faux" sont absolument identiques à l'exception d'une seule dimension (la dimension _vérité_-_fausseté_) pour laquelle "vrai" aurait la valeur `1` et "faux" la valeur `-1`. En réalité, il s'agit juste de dimensions _ad hoc_ initiées aléatoirement avec lesquelles construire un modèle statistique, mais les percevoir ainsi nous permet de comprendre certaines des choses qu'on peut faire avec.

L'une des tâches d'évaluations auxquelles les _word embeddings_ sont parfois soumis est dite _d'analogie_. Elle consiste à prendre un mot `A1`, par exemple "France" auquel on soustrait un mot `A2`, "Paris". _Soustraire_, parce que l'intérêt des _word embeddings_ est la possibilité qu'ils offrent de réaliser des opérations mathématiques sur des mots. On soustrait donc `A2` ("Paris") à `A1` ("France"), et on obtient un vecteur `v`. On additionne ensuite ce vecteur `v` à un point `B1`, disons "Allemagne" et l'on doit pouvoir prévoir le point `B2 = B1 + v`: "Berlin". "Berlin" (`B2`) est dans la même relation sémantique à "Allemagne" (`B1`) que "Paris" (`A2`) à "France" (`A1`) car le vecteur qui relie "Paris" à "France" est (devrait être) identique au vecteur qui relie "Berlin" à "Allemagne": c'est le vecteur "être la capitale de"[^vecteur_capitale].

[^vecteur_capitale]: C'est un exemple très souvent cité. Naturellement, les vecteurs ne sont pas absolument identiques, précisément parce que le sens d'un mot n'est pas un concept contenu dans le mot, mais réside dans les choses que l'on fait avec ces mots, et l'on ne fait les mêmes choses avec les mots "France" ou "Allemagne", "Paris" ou "Berlin". La pertinence de cette tâche est d'ailleurs, parfois débattue.

<!--
Quels sont, ainsi compris, les 10 mots les plus proches de "écrire" dans mon corpus? "lire", "rédiger", "pondre", "débuter", "réécrire", "relire", "terminer", "travailler", "corriger". Évidemment, cette liste est spécifique au forum de littérature, car "pondre", par exemple, est, dans d'autres corpus, beaucoup moins fortement associé à l'écriture. En fait, c'est précisément à ces écarts entre un corpus-objet et un corpus de référence qu'on peut s'intéresser.
-->
En raison du nombre élevé de dimensions, il n'est pas évident de représenter des _word embeddings_. On ne peut en représenter qu'un aspect, qu'une portion. La visualisation qui suit représente le degré de proximité de quelques verbes avec les mots "lire" (axe horizontal) et "écrire" (axe vertical). Elle compare deux modèles de _word vectors_: celui entraîné sur mon corpus, le forum de littérature et un autre entraîné sur un [corpus générique](https://github.com/thjbdvlt/french-word-vectors) que j'ai constitué.

<p class="info-donnees">
La visualisation est interactive: positionner le curseur sur un point (un mot) affiche le mot en question et agrandi le point. Le point correspondant au même mot dans l'autre corpus est aussi agrandi, afin de pouvoir facilement établir la comparaison.
</p>

<div id="vecteurs"></div>
<script type="module" src="./js/vectors/lire_ecrire.js"></script>

{même visualisation mais avec production/consommation ou produire/consommer}

{même visualisation mais avec fabriquer/utiliser?}

# la composition des rôles

Ce réseau d'activités est aussi, naturellement, un réseau de personnes (d'acteur·rices): auteur·rices, relecteur·rices, éditeur·rices, critique, lecteur·rices, etc. qui, toutes, participent à ce que le sociologue Howard Becker appelle un "monde de l'art[^becker_reseau]". Un "monde de l'art", c'est tout d'abord un ensemble d'"activités", de "conventions" et de "savoirs partagés"[@becker2017]. C'est, ensuite, non les personnes qui exercent ces activités, mais les _rôles_ (ou fonctions) que les délimitations entre ces activités définissent.

[^becker_reseau]: C'est vraiment comme d'un réseau que Becker parle des mondes de l'art: "réseau de personnes qui coopèrent[@becker2017, p.59]", "réseau d'activités[@becker2013a, p.81]" ou encore "réseau de coopération[@becker2017, p.49]".

Dans les "mondes de l'art" (plus que dans d'autres mondes socioprofessionnels), il est courant qu'une personne remplisse plusieurs rôles. C'est par exemple le cas des artistes les plus précaires, qui s'occupent à la fois de la fabrication des oeuvres, de leur diffusion et de la production du discours critique[@menger2002, voir surtout ses cours au collège de France. Voir aussi @cometti2017].
Sur le forum [Jeunes Écrivain·es](https://www.jeunesecrivains.com/) personne n'est uniquement correcteur·rice ou relecteur·rice, ni uniquement auteur·rice.
Or, ces _rôles multiples_ ne se combinent pas aléatoirement: certains rôles sont, en quelque sorte, très _pérméables_, d'autres nécessitent des compétences spécifiques et ne peuvent se combiner qu'avec certains rôles, etc.

Dans la visualisation qui suit, j'essaie de représenter le réseau que constituent ces rôles en utilisant les mots-composés désignant des rôles littéraires comme "auteur·rice-compositeur·rice", "auteur·rice-lecteur·rice" ou "relecteur·rice-typographe".

<p class="info-donnees">
Chaque _edge_ du graphe représente un mot composé présent dans le corpus ("écrivain·e-entrepreneur·euse") et chaque _node_ un mot-composant. La dimension des _nodes_ (mot) correspond à leur fréquence dans le corpus, et l'épaisseur des _edges_ à la fréquence des mots composés.
La visualisation est interactive: on peut déplacer les _nodes_ pour réorganiser spatialement le graphe. Passer la souris sur un _node_ fait apparaître le lemme qu'il représente (et son nombre total d'occurrence dans le corpus).
La production des données pour ce graphe s'est faite de façon itérative. J'ai commencé par dresser une [liste](./data/composition-roles/roles_base.txt) (__A__) de _rôles_ littéraires ("auteur·rice", "lecteur·rice", "imprimeur·euse", etc.). J'ai ensuite récupéré à l'aide des _word vectors_, pour chacun de ces mots, les 10 mots les plus proches dans le corpus, pour arriver à une liste (__B__) d'une centaine de mots pour laquelle j'ai récupéré, _via_ des requêtes SQL, une liste (__C__) des mots composés qui les contenaient, par exemple "auteur·rice-typographe". J'ai alors manuellement trié ces mots-composés et refait la procédure en ajoutant les mots de la liste __C__ à la liste __B__ (en ajoutant donc, par exemple, "typographe"). À chaque étape du processus, j'ai retranché les mots composés qui n'étaient pas des compositions de rôles (où chaque lemme simple est un rôle), par exemple "néo-écrivain·e" ou "non-lecteur·rice", car "néo" et "non" ne sont pas des rôles littéraires.
</p>

<div id="composition-roles"></div>
<script type="module" src="./js/composition-roles.js"></script>

# personnes

La dernière visualisation que je propose dans cette exploration des activités littéraires sur le forum concerne le sens grammatical du mot _personne_. Il s'agit de se demander s'il y a des activités qui, dans les textes du forum, apparaissent comme fondamentalement _collective_ (usages pluriels très fréquent) ou comme fondamentalement _ancrés dans la conversation_ (usage très fréquent des pronoms déictique pure -- 1ère et 2ème personne) et manifestant ainsi, par exemple, une forme de coopération littéraire par l'échange.

<p class="info-donnees">
Dans ma base de données, il y a une table __mot__ (tel mot particulier dans tel texte) qui contient une référence à une table __lexeme__ (le mot, avec toutes ses caractéristiques, mais hors de son contexte: le mot _possible_), laquelle contient le __lemme__ (le mot non fléchi, que j'utilise pour toutes les visualisations[^numerique]) mais aussi les informations morphologiques qui correspondent au format [FEATS](https://universaldependencies.org/u/feat/index.html), lequel correspond à un format __clé-valeur__. Les clés qui m'intéressent ici sont `Number` et `Person`. Par exemple, le lexème "serions" aurait pour `Number` la valeur `Plur` et pour `Person` la valeur `1`. Mais en réalité, récupérer ces informations est un peu plus compliqué, et l'analyse morphologique n'est pas suffisante. Il faut aussi une analyse des relations syntaxiques pour pouvoir intégrer des cas comme "j'ai écrit". En effet, "écris", en tant que participe passé, ne porte pas ces valeurs, il faut donc les récupérer de son auxiliaire, lequel n'est pas forcément placé juste avant le verbe. Les temps composés étant extrêmement courant en français, ces cas représentent une portion trop importante (~30% de la visualisation qui suit) pour être laissés de côtés, c'est pourquoi, en plus du _morphologizer_, il faut utiliser un _syntactic dependency parser_ qui va annoter les textes en mettant en relation les mots entre eux. C'est ainsi que j'ai pu déterminer les auxiliaires des verbes et récupérer (dans les requêtes SQL) leurs caractéristiques morphologiques, que j'ai transmises à leur verbe (noyau).
</p>

[^numerique]: En réalité, la table __lexeme__ contient seulement une référence vers les tables __lemme__ et __morphologie__ mais la compréhension du processus de production des données se passe de cet aspect.

<div id="personnes-grammaires"></div>
<script type="module" src="./js/personne-grammaire.js"></script>

[^1]: Voir, par exemple, les textes de Florent Coste[@coste2017a], ou dans une certaine mesure de Jérôme Meizoz [@meizoz2016]. Le deuxième paragraphe de l'article Wikipedia "Littérature" ajoute à la définition de la littérature comme corpus la définition de la littérature comme activité (mais uniquement comme activité de _création_, excluant par exemple la lecture); au reste, cette définition n'est pas la définition que donne l'article, mais uniquement une précision sur l'évolution de la notion de littérature.

[^spacy_fr]: Les modèles proposés par __spaCy__ pour le français ont été entraînés sur des données extrêmement incomplètes. Le pronom _tu_ y est par exemple totalement absent et est donc systématiquement annoté de façon aléatoire (le corpus d'entraînement est uniquement constitué de textes issus de la presse écrite).

<script src="./js/composition-roles.js"></script>


# bibliographie
