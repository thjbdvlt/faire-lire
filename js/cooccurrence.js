/* premières visualisations (si un tableau est une visualisation): les 
 * verbes avec lesquels les verbes 'lire' et 'écrire' ont le plus 
 * de cooccurrence. il y a deux tableaux: un pour 'lire' et l'autre
 * pour 'écrire'. */

const elem = d3.select("#cooccurrence")

const groups = {
  mot: 'mot',
  nombre: 'nombre'
}

for (let word of ["lire", "ecrire"]) {

  /* une table pour chaque mot dans l'array */
  let table = elem.append("table")

  /* à chaque mot dans l'array correspond un fichier */
  let path = "./data/cooccurrence/";
  path += word;
  path += ".csv";

  table.append('th').text(word);

  d3.csv(path).then(data => {

    for (let i of data) {

      /* une ligne dans le tableau pour chaque ligne dans le csv */
      let tr = table.append("tr");

      /* deux colonnes:
       * 1) le verbe;
       * 2) le nombre de cooccurrences
       * */
      let td = tr.append("td")
      td.text(i.verbe)
      td.attr('class', groups.mot)

      td = tr.append("td")
      td.text(i.cooccurrence)
      td.attr('class', groups.nombre)
    }

  })
}
