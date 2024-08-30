/* l'element dans lequel placer le graphe */
const container = d3.select("#container").node()

/* le json contenant les données */
const path_data = './data/mots_composes.json';

d3.json(path_data).then(data => {

    /* je ne garde (pour l'instant) que les (..?) */
    const lemmes_composes = data.filter(
            d => d.split('-').length == 2
        )
    let x = [];

    const lemmes_decomposes = Array.from(new Set(lemmes_composes.map(d => d.split('-').sort())));
    const lemmes_simples = new Set(lemmes_decomposes.flatMap(d => d));

    /* deux types d'objets sont nécessaires pour un graphe:
     * 1. des nodes
     * 2. des edges
     * */
    let nodes = [];
    let edges = [];
    let d = {};

    // je vais utiliser des identifiants numériques, que je vais simplement construire par incrémentation.
    let n = 0;

    // ajouter dans les nodes les lemmes simples.
    for (let i of lemmes_simples) {
        nodes.push({label: i});
        d[i] = {id: n, edgecount: 0};
        n++;
    };

    let already_edges = [];

    // les lemmes composés sont des edges
    for (let s of lemmes_decomposes) {
        let i = s.sort();
        const source_label = i[0]
        const target_label = i[1]
        if ((source_label in already_edges.keys()) && (already_edges[source_label].includes(target_label))) {
            continue
        }
        else {
            const source = d[source_label]
            const target = d[target_label]
            let source_id = source.id
            let target_id = target.id
            target.edgecount ++
            source.edgecount ++
            edges.push({source: source_id, target: target_id})
            if (source_label in already_edges.keys()) {
                already_edges.source_label.push(target_label)
            } else {
                already_edges[source_label] = [target_label]
            }
            
        }
    }

    for (let i of nodes) {
        if (d[i.label].edgecount === 1) {
            i.label = null
        }
    }

    const width = 2000;
    const height = 1000;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // les fonctions de `d3.force` modifient les objets qu'elles prennent en paramètres. donc: faire des copies.
    const graph_nodes = nodes.map(d => ({
        ...d
    }));
    const graph_edges = edges.map(d => ({
        ...d
    }));

    const simulation = d3.forceSimulation(graph_nodes)
        .force("link", d3.forceLink(graph_edges))
        .force("charge", d3.forceManyBody().strength(-400))
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
        .attr("r", 5)
        .attr("fill", 'skyblue'
        );

    let labels = node.append("text")
        .text(function(d) {
            return d.label;
        });

    simulation
        .nodes(graph_nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph_edges);

    function ticked() {
        link
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });
        node
            .attr("transform",
                function(d) {
                    return `translate(${d.x},${d.y})`
                }
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


});
