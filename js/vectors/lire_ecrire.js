import {
  make_scatterplot_embeddings
} from './scatterplot.js';

make_scatterplot_embeddings("./data/vectors/verbes_similarite.json", [
  "forum", "générique"
], ["lire", "ecrire"], "#vecteurs")