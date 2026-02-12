// app.js
const pokeContainer = document.getElementById('poke-container');
const searchInput = document.getElementById('search');
const loader = document.getElementById('loader');

// Estado local de la aplicación
let allPokemons = [];

/**
 * Función principal: Obtiene los primeros 151 Pokémon
 */
async function fetchPokemons() {
    toggleLoader(true);
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        
        // Mapeamos los resultados para obtener los detalles de cada uno
        const detailPromises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        allPokemons = await Promise.all(detailPromises);
        
        renderPokemons(allPokemons);
    } catch (error) {
        console.error("Error al obtener datos:", error);
        pokeContainer.innerHTML = `<p class='col-span-full text-center'>Error al cargar la Pokédex.</p>`;
    } finally {
        toggleLoader(false);
    }
}

/**
 * Renderizado en el DOM
 */
function renderPokemons(pokemonList) {
    pokeContainer.innerHTML = ''; // Limpiar contenedor
    
    pokemonList.forEach(poke => {
        const typeColor = getTypeColor(poke.types[0].type.name);
        const card = document.createElement('div');
        card.className = `bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer border-b-4 ${typeColor.border}`;
        
        card.innerHTML = `
            <div class="p-4 flex flex-col items-center">
                <span class="text-xs font-bold text-gray-400 self-end">#${poke.id.toString().padStart(3, '0')}</span>
                <img src="${poke.sprites.other['official-artwork'].front_default}" 
                     alt="${poke.name}" class="w-32 h-32 object-contain my-2">
                <h3 class="capitalize font-bold text-lg text-gray-800">${poke.name}</h3>
                <div class="flex gap-2 mt-2">
                    ${poke.types.map(t => `<span class="px-2 py-0.5 rounded-full text-[10px] text-white uppercase font-bold ${typeColor.bg}">${t.type.name}</span>`).join('')}
                </div>
            </div>
        `;
        pokeContainer.appendChild(card);
    });
}

/**
 * Lógica de Filtrado (Tiempo Real)
 */
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allPokemons.filter(p => p.name.toLowerCase().includes(term));
    renderPokemons(filtered);
});

// Helpers
function toggleLoader(show) {
    loader.classList.toggle('hidden', !show);
}

function getTypeColor(type) {
    const colors = {
        fire: { bg: 'bg-orange-500', border: 'border-orange-500' },
        water: { bg: 'bg-blue-500', border: 'border-blue-500' },
        grass: { bg: 'bg-green-500', border: 'border-green-500' },
        electric: { bg: 'bg-yellow-400', border: 'border-yellow-400' },
        poison: { bg: 'bg-purple-500', border: 'border-purple-500' },
        default: { bg: 'bg-gray-400', border: 'border-gray-400' }
    };
    return colors[type] || colors.default;
}

// Iniciar carga
fetchPokemons();