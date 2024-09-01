import {
  color
} from "./colors.js";
import {
  body_padding,
  margin,
  width,
  height
} from "./dimensions.js";

const size = {
  default: 4,
  hover: 8
}

/* dernière visualisation: verbes et personnes grammaticales. */

const datapath = "./data/personnes/verbes_personnes_nombres.csv";
const divid = "#personnes-grammaires";

const div = d3.select(divid);

/* créer l'élément SVG. */
const svg = div.append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g").style('color', color.axis)
  .attr("transform", "translate(" + margin.left + "," + margin.top +
    ")");

/* axe horizontal: personne (émetteur·rice, interlocuteur·rice+autre)*/
var x = d3.scaleLinear()
  .domain([0, 1])
  .range([0, width]);
svg.append("g")
  .attr("transform", "translate(0," + height / 2 + ")")
  .call(d3.axisBottom(x).ticks(0, null)).style('opacity', 0.2);

/* axe vertical: nombre (singulier, pluriel) */
var y = d3.scaleLinear()
  .domain([0, 1])
  .range([height, 0]);
svg.append("g")
  .call(d3.axisLeft(y).ticks(0, null))
  .attr("transform", "translate(" + width / 2 + ",0)").style('opacity',
    0.2);

/* ajouter les titres des axes (de chaque côté) */
const labels = [{
    label: "Pluriel",
    x: 0.5,
    y: 1,
    xplus: 4,
    yplus: 12
  },
  {
    label: "Singulier",
    x: 0.5,
    y: 0,
    xplus: 4,
    yplus: -4
  },
  {
    label: "Déictique (1ère et 2ème personne)",
    x: 0,
    y: 0.5,
    rotate: true,
    xplus: 0,
    yplus: -4
  },
  {
    label: "Extralinguistique (3ème personne)",
    x: 1,
    y: 0.5,
    rotate: true,
    xplus: -220,
    yplus: -4
  },
]
for (let i of labels) {
  svg.append('text').attr('x', x(i.x) + i.xplus).attr('y', y(i.y) + i
    .yplus).text(i.label).style('fill', color.axis).style('font-size',
    '90%')
}


/* les deux fonctions suivantes calculent (1) la proportion 
 * d'occurrences du verbe conjuguée à la première personne (vs 
 * deuxième et troisième) et (2) la proportion d'occurrences
 * conjuguées au pluriel (vs singulier) */
function get_number(d) {
  let total = Number(d.sing) + Number(d.plur)
  let x = Number(d.plur) / total
  return x
}

function get_person(d) {
  let total = Number(d.first) + Number(d.second) + Number(d.third)
  let x = Number(d.third) / total
  return x
}

/* tooltip */
var tooltip = div
  .attr('id', 'tooltip-personnes')
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")

/* event hover */
var mouseover = function(event, d) {
  /* réveler le tooltip */
  tooltip.style("opacity", 1)
  /* il faut sélectionner plusieurs <circle> (2): les deux elements
   * qui ont le même attribut "mot" (les positions d'un mot dans les 2 corpus) */
  d3.select(this)
    .transition()
    .duration(1)
    .attr("r", size.hover)
}

/* event move */
var mousemove = function(event, d) {
  tooltip
    /* le contenu du tooltip est le mot */
    .html(d.verb)
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
  d3.select(this)
    .transition()
    .duration(1)
    .attr("r", size.default)
}

d3.csv(datapath).then(data => {
  /* ajoute les <circle> (un par mot) */
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(get_person(d)))
    .attr("cy", d => y(get_number(d)))
    .attr("r", d => size.default)
    .style("fill", color.mot)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

})