import {
  make_scatterplot_embeddings
} from './scatterplot.js';

make_scatterplot_embeddings(
  "./data/vectors/verbes_similarite_lire_écrire.json", [
    "forum", "générique"
  ], ["lire", "écrire"], "#vecteurs")