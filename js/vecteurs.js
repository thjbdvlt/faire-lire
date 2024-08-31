/* un scatterplot pour représenter la proximité de mots (vecteurs).
 *
 * je prends comme base de travail l'exemple suivant (scatterplot):
 * https://d3-graph-gallery.com/graph/scatter_basic.html
 *
 * pour les tooltips, je suis parti de ça:
 * https://d3-graph-gallery.com/graph/scatter_tooltip.html
 * (exemple qu'il a notamment fallu adapté à la version actuelle (v7))
 *
 * pour la position du tooltip relativement au curseur:
 * https://d3-graph-gallery.com/graph/interactivity_tooltip.html
 * */

const div = d3.select("#vecteurs")
import { color  } from "./colors.js";

/* quelques constantes:
 * - les noms des corpus.
 * - les noms des mots avec lesquels la proximité est calculée.
 * - le padding de la page (pour calcul width/height).
 * - les dimensions pour les <circle> selon qu'ils sont (ou non) 'hovered'
 * - les couleurs des <circles> (dépend du corpus)
 *   */
const corpora = ["forum", "general"];
const mots = ["lire", "ecrire"];
const datapath = "./data/vectors/verbes_similarite.json";
const body_padding = 20;
const size = {
  default: 2,
  hover: 8
}

/* propriétés du svg: longueur, largeur. elles sont calculées dynamiquement en prenant en compte la largeur et la hauteur de la fenêtre du navigateur.*/
const margin = {
    top: 10,
    right: 10,
    bottom: 30,
    left: 30
  },
  width = Math.min(800, window.innerWidth) - margin.left - margin
  .right - (body_padding * 2),
  height = Math.min(width, window.innerHeight - margin.top - margin
    .bottom)

/* créer l'élément SVG. */
const svg = div.append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top +
    ")");

/* tooltip */
var tooltip = div
  .attr('id', 'tooltip-vectors')
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")

d3.json(datapath).then(data => {

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

  /* ajouter les titres des axes */
  svg.append("text").attr("x", x(0)).attr("y", y(1)).text(
      "similarité avec " + mots[1])
    .style("text-anchor", "middle")
    .style("fill", color.axistitle).attr("transform", "rotate(90)");
  svg.append("text").attr("x", x(0)).attr("y", y(-1)).text(
    "similarité avec " + mots[0])
    .style("text-anchor", "middle")
    .style("fill", color.axistitle);

  /* event hover */
  var mouseover = function(event, d) {
    /* réveler le tooltip */
    tooltip.style("opacity", 1)
    /* il faut sélectionner plusieurs <circle> (2): les deux elements
     * qui ont le même attribut "mot" (les positions d'un mot dans les 2 corpus) */
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
      /* le contenu du tooltip est le mot */
      .html(d.mot)
      /* placer le tooltip près de la souris */
      .style("top", (event.pageY - 10) + "px")
      .style("left", (event.pageX + 10) + "px")
  }

  /* end event hover */
  var mouseleave = function(event, d) {
    /* retour à l'état par défaut: cacher le tooltip */
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
    /* ici, je ne suis pas sûr que cela soit nécessaire de filtrer, puisqu'on pourrait simplement remettre l'état par défaut à tous les éléments, y compris ceux qui n'ont pas changé. mais je ne sais pas si, du point de vue des performances, cela est vraiment mieux, et de toute manière je préfère faire les choses de façon symétriques: je redonne la taille initiale uniquement aux objets qui ont été modifiés. */
    d3.selectAll("circle")
      .filter(function(x, i) {
        return x.mot == d.mot
      })
      .transition()
      .duration(1)
      .attr("r", size.default)
  }
  /* iterate sur les deux nom de corpus pour construire les
   * deux layers */
  for (let corpus of corpora) {
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d[corpus][mots[0]]))
      .attr("cy", d => y(d[corpus][mots[1]]))
      .attr("r", size.default)
      .style("fill", color[corpus])
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  }
})
