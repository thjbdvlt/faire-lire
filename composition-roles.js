/* première visualisation (si un tableau est une visualisation): 
* les verbes avec lesquels le verbe 'lire' a le plus de cooccurrence. */
d3.csv("./data/cooccurrence_lire.csv").then(data=> {
    for (let i of data) {
        let tr = d3.select("#lire").append("tr");
        tr.append("td").text(i.verbe)
        tr.append('td').text(i.cooccurrence)
    }
})

/* deuxième visualisation: deuxième tableau (écrire) */
d3.csv("./data/cooccurrence_ecrire.csv").then(data=> {
    for (let i of data) {
        let tr = d3.select("#ecrire").append("tr");
        tr.append("td").text(i.verbe)
        tr.append('td').text(i.cooccurrence)
    }
})
