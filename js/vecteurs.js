/* un scatterplot pour représenter la proximité de mots (vecteurs).
 *
 * je prends comme base de travail l'exemple suivant (scatterplot):
 * https://d3-graph-gallery.com/graph/scatter_basic.html
 *
 * pour les tooltips, je suis parti de ça:
 * https://d3-graph-gallery.com/graph/scatter_tooltip.html
 * (exemple qu'il a notamment fallu adapté à la version actuelle (v7))
 * */

const div = d3.select("#vecteurs")
const body_padding = 20;

/* quelques constantes:
 * - les noms des corpus
 * - les dimensions pour les <circle> selon qu'ils sont (ou non) 'hovered'
 * - les couleurs des <circles> (dépend du corpus)
 *   */
const corpora = ["forum", "general"];
const size = {
  default: 2,
  hover: 8
}
const color = {
  forum: "#69b3a2",
  general: "#ff00ff"
}

/* propriétés du svg: longueur, largeur. */
const margin = {
    top: 10,
    right: 10,
    bottom: 30,
    left: 60
  },
  width = Math.min(800, window.innerWidth) - margin.left - margin
  .right - body_padding,
  height = Math.min(width, window.innerHeight - margin.top - margin
    .bottom)

/* créer l'élément SVG. */
const svg = div.append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top +
    ")");

d3.json("./data/vectors/verbes_similarite.json").then(data => {

  /* axe horizontal: "écrire" */
  var x = d3.scaleLinear()
    .domain([-1, 1])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  /* axe vertical: "lire" */
  var y = d3.scaleLinear()
    .domain([-1, 1])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  /* tooltip */
  var tooltip = div
    .attr('id', 'tooltip-vectors')
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")

  /* event hover */
  var mouseover = function(event, d) {
    tooltip
      .style("opacity", 1)
    d3.selectAll("circle")
      .filter(function(x, i) {
        return x.mot == d.mot
      })
      .transition()
      .duration(1)
      .attr("r", size.hover)
  }

  /* event move */
  var mousemove = function(event, d) {
    tooltip
      .html(d.mot)
      .style("left", (d3.mouse(this)[0] + 90) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  /* end event hover */
  var mouseleave = function(event, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
    d3.selectAll("circle")
      .filter(function(x, i) {
        return x.mot == d.mot
      })
      .transition()
      .duration(1)
      .attr("r", size.default)
  }

  /* iterate sur les deux nom de corpus pour construire les deux layers */
  for (let corpus of corpora) {
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d[corpus].lire))
      .attr("cy", d => y(d[corpus].ecrire))
      .attr("r", size.default)
      .style("fill", color[corpus])
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  }
})