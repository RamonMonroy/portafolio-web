// logica.js

// 1. Referencia al contenedor HTML donde pondremos las tarjetas
const contenedor = document.getElementById('contenedor-personajes');

// 2. Función Asíncrona para pedir los datos
async function obtenerPersonajes() {
    try {
        // Hacemos la petición a la API (Como escribir la URL en el navegador)
        const respuesta = await fetch("https://rickandmortyapi.com/api/character");
        
        // Convertimos la respuesta cruda a JSON comprensible
        const datos = await respuesta.json();
        
        // Imprimimos en consola para verificar (F12)
        console.log(datos.results);

        // Mandamos los datos a la función que dibuja
        dibujarTarjetas(datos.results);

    } catch (error) {
        console.error("Hubo un error al conectar con la API:", error);
    }
}

// 3. Función para generar el HTML dinámicamente
function dibujarTarjetas(personajes) {
    // Recorremos la lista de personajes (Foreach)
    personajes.forEach(personaje => {
        
        // Creamos el HTML de UNA tarjeta usando Template Strings (``)
        const tarjetaHTML = `
            <div class="tarjeta">
                <img src="${personaje.image}" alt="${personaje.name}">
                <div class="info">
                    <h3>${personaje.name}</h3>
                    <p class="estado">
                        <span class="${personaje.status === 'Alive' ? 'vivo' : 'muerto'}">●</span> 
                        ${personaje.status} - ${personaje.species}
                    </p>
                    <p>Ubicación: ${personaje.location.name}</p>
                </div>
            </div>
        `;

        // INYECCIÓN DOM: Agregamos este bloque al contenedor padre
        contenedor.innerHTML += tarjetaHTML;
    });
}

// 4. Ejecutar la función al iniciar
obtenerPersonajes();
