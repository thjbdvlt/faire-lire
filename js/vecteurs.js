/* un scatterplot pour représenter la proximité de mots (vecteurs)
 * avec "lire" et "écrire". 
 *
 * je prends comme base de travail l'exemple fourni par observable
 * dans la "gallery" (essentiellement pour les labels):
 * https://observablehq.com/@d3/scatterplot/
 *
 * et aussi ça (pour le reste):
 * https://d3-graph-gallery.com/graph/scatter_basic.html
 * */

const div = d3.select("#vecteurs")

/* propriétés du svg: longueur, largeur.
 * TODO: calculer dynamiquement?*/
const margin = {
        top: 10,
        right: 10,
        bottom: 30,
        left: 60
    },
    width = 400 - margin.left - margin.right,
    height = width

/* créer l'élément SVG. */
const svg = div.append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  var tooltip = div
    .attr('id', 'tooltip-vectors')
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")

  var mouseover = function(event, d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(event, d) {
    tooltip
      .html(d.mot)
      .style("left", (d3.mouse(this)[0]+90) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  var mouseleave = function(event, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }


  /* ajoute un premier ensemble de points: les vecteurs du forum */
  svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.forum.lire))
      .attr("cy", d => y(d.forum.ecrire))
      .attr("r", 4)
      .style("fill", "#69b3a2")
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )


  ///* ajoute un deuxième ensemble de points: les vecteurs génériques */
  // svg.append('g')
  //   .selectAll("dot")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //     .attr("cx", d => x(d.general.lire))
  //     .attr("cy", d => y(d.general.ecrire))
  //     .attr("r", 1)
  //     .style("fill", "#ff00ff")
  //
  // // Add a layer of labels.
  // svg.append("g")
  //     .attr("font-family", "sans-serif")
  //     .attr("font-size", 10)
  //   .selectAll("text")
  //   .data(data)
  //   .join("text")
  //     .attr('class', 'mot')
  //     .attr("dy", "0.35em")
  //     .attr("x", d => x(d.forum.lire)-20)
  //     .attr("y", d => y(d.forum.ecrire))
  //     .text(d => d.mot).style('fill', 'white');

})
