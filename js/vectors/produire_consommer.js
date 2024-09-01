import {
  make_scatterplot_embeddings
} from './scatterplot.js';

make_scatterplot_embeddings(
  "./data/vectors/verbes_similarite_produire_consommer.json", [
    "forum", "générique"
  ], ["produire", "consommer"], "#vecteurs-produire-consommer")