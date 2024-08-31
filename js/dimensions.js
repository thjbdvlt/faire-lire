/* propriétés du svg: longueur, largeur. elles sont calculées dynamiquement en prenant en compte la largeur et la hauteur de la fenêtre du navigateur.*/
const body_padding = 20;
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

export {
  body_padding,
  margin,
  width,
  height
}