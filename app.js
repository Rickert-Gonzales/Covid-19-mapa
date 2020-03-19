//importamos los estilos para el mapa
import styles from "./styles.js";

//asignamos el div con id mapa a una constantes
const $map = document.querySelector("#map");

//llamamos a la clase mapa que tiene nuestra API
//primer parametro - pasar la clase con el id map
//segundo parametro - difinor en donde se dibuja el mapa
const map = new window.google.maps.Map($map, {
  center: {
    lat: 0,
    lng: 0
  },
  zoom: 3,
  styles
});

renderData();

//funcion para obtener datos o consumir servicio
async function getData() {
  //consumimos la api de geolocalizacion y lo introducimos en un const
  const response = await fetch(
    "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest"
  );
  const data = await response.json();
  return data;
}

//ahora que ya tenemos los puntos o pines hubicados, pondremos la informacion de ellos
//para eso usaremos la clase de google llamada InfoWindow
const popup = new window.google.maps.InfoWindow();

//creamos una funcion que nos permita renderizar la informacion de cada punto o pin del API
function renderExtraData({
  confirmed,
  deaths,
  recovered,
  provincestate,
  countryregion
}) {
  //creamos el html donde se agruparan los datos
  return `
  <div>
    <p><b> ${countryregion} - ${provincestate} </b></p>
    <p> confirmados: ${confirmed}</p>
    <p> muertes: ${deaths}</p>
    <p> recuperados: ${recovered}</p>
  </div>
  `;
}

//renderizamos el mapa
async function renderData() {
  const data = await getData();
  console.log(data);

  //como ya tenemos todos los valores dentro de un arreglo, solo lo iteraremos
  //para mandarlos como pines dentro del mapa
  data.forEach(item => {
    //creamos un if que nos mostrara solo los datos que no contengan ceros en la api
    if (item.recovered && item.confirmed > 0) {
      //como ya tenemos los datos de de los lugares, ahora pondremos los puntos en el mapa
      //para ello llamamos a una clase llamada Marker
      const marker = new window.google.maps.Marker({
        position: {
          lat: item.location.lat,
          lng: item.location.lng
        },
        map,
        //para modificar el icono del pin usaremos icon
        icon: "./icon.png"
      });

      //con esta linea de codigo se mostrara la informacion de los pines o puntos
      //cada que hagan click en ellas
      marker.addListener("click", () => {
        //mandamos la informacion del API al navegador
        popup.setContent(renderExtraData(item));

        //InfoWindow nesesita de una funcion llamada onpen
        popup.open(map, marker);
      });
    }
  });
}
