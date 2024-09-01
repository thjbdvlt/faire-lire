import {
  make_scatterplot_embeddings
} from './scatterplot.js';

make_scatterplot_embeddings(
  "./data/vectors/verbes_similarite_fabriquer_utiliser.json", [
    "forum", "générique"
  ], ["fabriquer", "utiliser"], "#vecteurs-fabriquer-utiliser")