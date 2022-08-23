/*Variables*/
const menuMovilContenedor = document.querySelector(".menu-movil-contenedor");
const menuMovileBoton = document.querySelector(".menu-movil-boton");
const contenedorFormulario = document.querySelector(".shorter-contenedor-link");
const agregarUrlsAcortados = document.querySelector(".agregar-urls-acortados");

let arrayLinks = [];

const crearItem = async(inputAcortarUrl) => {

    let respuesta = await fetch(`https://api.shrtco.de/v2/shorten?url=${inputAcortarUrl}`);
    let datos = await respuesta.json();

    let links = {

            linkOriginal: datos.result.original_link,
            linkAcortado: datos.result.short_link
        }

    arrayLinks.push(links);
    return links;
}

const GuardarDB = () => {

    localStorage.setItem("datosAlmacenadosEnLocalStorage", JSON.stringify(arrayLinks));
    crearFormulario();
}

const crearFormulario = () => {
    agregarUrlsAcortados.innerHTML = "";

    arrayLinks = JSON.parse(localStorage.getItem("datosAlmacenadosEnLocalStorage"));

    if (arrayLinks === null) {
        arrayLinks = [];

    }else {
        arrayLinks.forEach(element => {
            agregarUrlsAcortados.innerHTML += 
            `
            <article class="url-acortado">
                <p class="parrafo-link-original">${element.linkOriginal}</p>
                <p class="parrafo-link-acortado">${element.linkAcortado}</p>
                <button name="boton-copiar" class="copiar-link-boton">Copiar</button>
                <button name="boton-borrar" class="borrar-link-boton">Borrar</button>
                </article>
            `
        });
    }
}

const eliminarDB = (actividad) => {
    let indexLinks;

    arrayLinks.forEach((element, index) => {

    if (element.linkOriginal === actividad) {
        indexLinks = index;
        }
    })

    arrayLinks.splice(indexLinks, 1);
    GuardarDB();
}

/*Evento para generar el contenedor con la URL acortada */
contenedorFormulario.addEventListener("submit", (e) => {
    e.preventDefault();

    let inputAcortarUrl = document.querySelector(".input-shorten").value;

    crearItem(inputAcortarUrl);
    GuardarDB();
    contenedorFormulario.reset();
})

/*Evento para abrir y cerrar el menú de navegación movíl */
menuMovileBoton.addEventListener("click", () => {
    menuMovilContenedor.classList.toggle("inactive");
})

document.addEventListener("DOMContentLoaded", crearFormulario);

agregarUrlsAcortados.addEventListener("click", (e) => {
    e.preventDefault();

    console.log(e)
    if (e.target.name === "boton-copiar") {
        e.target.style.backgroundColor = "hsl(257, 27%, 26%)";
        e.target.innerText = "Copiado!"
        navigator.clipboard.writeText(e.path[1].childNodes[3].innerHTML);

    }else if(e.target.name === "boton-borrar"){
        eliminarDB(e.composedPath[0]);
    }
})