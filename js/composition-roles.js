/* je travaille à partir du code trouvé ici:
 * https://observablehq.com/@d3/force-directed-graph/
 * */

// const div = d3.select("#composition-roles").node()
const div = d3.select("#composition-roles")

const path_composition =
"../data/composition-roles/mots_composes.csv";
const path_occurrence = "../data/composition-roles/occurrences.csv";

import {
  color
} from "./colors.js";

d3.csv(path_composition).then(data => {

  let nodes = [];
  let id;
  let lookup = {};

  d3.csv(path_occurrence).then(occurrences => {
      for (let d of occurrences) {
          nodes.push(d)
      }
  })

  // let edges = [];
  // let d = {};
  // /* je vais utiliser des identifiants numériques, que je vais simplement construire par incrémentation. */
  // let id = 0;
  //
  //   for (let d of data) {
  //       nodes.push(d)
  //   }

})
