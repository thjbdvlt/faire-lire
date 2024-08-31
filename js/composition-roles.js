import {
  color
} from "./colors.js";
import {
  body_padding,
  margin,
  width,
  height
} from "./dimensions.js";

/* je travaille à partir du code trouvé ici:
 * https://observablehq.com/@d3/force-directed-graph/
* */

/* quelques constantes pour les dimensions des edges et nodes */
const max_node_radius = 20;
const min_node_radius = 3;
const max_link_width = 3;

/* selectionner l'élemetn qui va contenir le SVG */
const div = d3.select("#composition-roles")

/* deux CSV servent à produire cette visualisation.
 * - un pour les nodes-lemme (et leur nombre d'occurence)
 * - un pour les linke-lemme-composé (et nombre d'occurrence) */
const path_composition = "./data/composition-roles/mots_composes.csv";
const path_occurrence = "./data/composition-roles/occurrences.csv";

/* récupérer les données des deux fichiers */
d3.csv(path_composition).then(data_links => {
    d3.csv(path_occurrence).then(data_nodes => {

    /* créer une copie des arrays (car ils sont modifiés par d3) */
    const links = data_links.map(d => ({...d}));
    const nodes = data_nodes.map(d => ({...d}));

    /* récupérer le nombre d'occurrences maximum pour un lemme, afin
     * que la largeur des <circle> soient définie relativement à 
     * ce maximum */
    let max = 0;
    nodes.map(d => {
      if (d.count > max) {
        max = Math.max(max, d.count)
      }
    })

    /* la fontion qui calcule la largeur d'un <circle> sur la base
     * du nombre d'occurrences du lemme */
    function get_width(count) {
      return Math.max(max_node_radius * (count / max), min_node_radius)
    }

/* les blocs qui suivent sont repris, presque sans modifications, du
 * code trouvé ici:
 * https://observablehq.com/@d3/force-directed-graph/
 * à l'exception, toutefois, des functions que j'ajoute pour les
* largeurs et rayons des <circle> et <line> */

  // Create a simulation with several forces.
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  // Add a line for each link, and a circle for each node.
  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll()
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.min(max_link_width, d.count));

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .join("circle")
      .attr("r", d => get_width(d.count))
      .attr("fill", "red");

  node.append("title")
      .text(d => d.id);

  // Add a drag behavior.
  node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  // Set the position attributes of links and nodes each time the simulation ticks.
  function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  }

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

div.node().append(svg.node());

    })
})
