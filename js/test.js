// je fais quelques tests avec des mini-données

// https://stackoverflow.com/questions/63446134/javascript-d3-js-forced-directed-graph-with-label
//
// pour ce qui concerne, surtout, le drag and drop, j'ai simplement repris les fonctions du code ici:
// https://observablehq.com/@d3/force-directed-graph/2?intent=fork
//
// mais mixé avec pas mal d'autres trucs, et au départ les guides de d3
//
// ce qui serait bien: 
// 1. que les labels des lemmes composés soient visibles que lors du passage de la souris.
// 2. que les lemmes simples qui n'apparaissent pas, ou que les adpositions, soient dans une autre couleurs que les lemmes simples qui sont aussi des lemmes.
// 3. que les cercles aient une dimension relative au nombre d'occurrence.
// 4. qu'il y ait des positions prédéfinies sur des termes qui me semblent particulièrement intéressants, comme des cadrages. genre presser sur un trucs et ça modifie la position (x, y) de certains nodes.

// une liste de lemmes composés
const lemmes_composes = [
    "beta-lecteur·rice",
    "co-auteur·rice",
    "auteur·rice-compositeur·rice",
    "éditeur·rice-auteur·rice",
    "auteur·rice-compositeur·rice-interprète",
    "lecteur·rice-auteur·rice",
];
// j'en extrait les lemmes simples (les composants)
const lemmes_decomposes = lemmes_composes.map(d => d.split('-'));
const lemmes_simples = new Set(lemmes_decomposes.flatMap(d => d));

// deux types d'objets sont nécessaires pour un graphe:
// 1. des nodes
// 2. des egdes
let nodes = [];
let edges = [];
let d = {};

// je vais utiliser des identifiants numériques, que je vais simplement construire par incrémentation.
let n = 0;

// ajouter dans les nodes les lemmes simples.
for (let i of lemmes_simples) {
    nodes.push({
        // le label est le lemme lui-même
        label: i,
        // pour distinguer lemmes simples des lemmes composées
        compound: false
    });
    d[i] = n;
    n++;
};

// ajouter les lemmes composés
for (let i of lemmes_decomposes) {
    nodes.push({
        label: i.join("-"),
        compound: true
    });
    for (let c of i) {
        for (let s of nodes) {
            if (s.label === c) {
                edges.push({
                    source: n,
                    target: d[s.label]
                });
                break
            }
        }
    }
    n++;
};

const width = 1000;
const height = 800;
const color = d3.scaleOrdinal(d3.schemeCategory10);

// les fonctions de `d3.force` modifient les objets qu'elles prennent en paramètres. donc: faire des copies.
const graph_nodes = nodes.map(d => ({...d}));
const graph_edges = edges.map(d => ({...d}));

const container = d3.select("#container").node()

const simulation = d3.forceSimulation(graph_nodes)
    .force("link", d3.forceLink(graph_edges))
    // .force("charge", d3.forceManyBody().strength(-1000))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(0, 0))
    .on("tick", ticked);

const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");

const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(graph_edges)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

let node = svg.append("g")
    .selectAll("g")
    .data(graph_nodes)
    .enter()
    .append("g")
    .attr("class", "node");

let circles = node.append("circle")
    // .data(graph_nodes)
    .attr("r", 10)
    .attr("fill",
        d => {
            if (d.compound == true) {
                return "violet"
            } else {
                return "skyblue"
            }
        }
    );

let labels = node.append("text")
    .text(function(d){return d.label;});

simulation
    .nodes(graph_nodes)
    .on("tick", ticked);

simulation.force("link")
    .links(graph_edges);

function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node
        .attr("transform", 
            function(d) 
            { return `translate(${d.x},${d.y})` }
        );
}

node.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

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

container.append(svg.node())
