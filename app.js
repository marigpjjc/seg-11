class Agente {
    constructor(nombre, rol, habilidades, imagen) {
        this.nombre = nombre;
        this.rol = rol;
        this.habilidades = habilidades;
        this.imagen = imagen || 'ruta/a/imagen-predeterminada.jpg';
    }
}

async function getAgents() {
    try {
        const response = await fetch('https://valorant-api.com/v1/agents');
        
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API: ' + response.status);
        }

        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            throw new Error('No se encontraron agentes.');
        }

        const agents = data.data.map(agent => {
            const habilidades = agent.abilities ? agent.abilities.map(ability => ability.displayName) : [];
            const rol = agent.role ? agent.role.displayName : 'Sin rol';
            return new Agente(agent.displayName, rol, habilidades, agent.fullPortrait);
        });

        return agents;
    } catch (error) {
        console.error('Error al obtener los agentes:', error);
        return [];
    }
}

function renderAgents(agents) {
    const container = document.getElementById('agents-container');
    container.innerHTML = ''; 

    agents.forEach(agent => {
        const agentDiv = document.createElement('div');
        agentDiv.classList.add('agent');

        const img = new Image();
        img.src = agent.imagen || 'ruta/a/imagen-predeterminada.jpg';
        
        img.onload = () => {
           
            agentDiv.innerHTML = `
                <img src="${agent.imagen || 'ruta/a/imagen-predeterminada.jpg'}" alt="${agent.nombre}" 
                     onerror="this.onerror=null; this.src='ruta/a/imagen-predeterminada.jpg';">
                <h2>${agent.nombre}</h2>
                <p>Rol: ${agent.rol}</p>
                <p>Habilidades: ${agent.habilidades.join(', ')}</p>
            `;
            container.appendChild(agentDiv);
        };

        img.onerror = () => {
            
            console.log(`${agent.nombre} tiene problemas para cargar su imagen.`);
        };
    });
}

async function init() {
    const agents = await getAgents();
    renderAgents(agents);

    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredAgents = agents.filter(agent => agent.nombre.toLowerCase().includes(searchTerm));
        renderAgents(filteredAgents);
    });
}

init();

function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    document.body.appendChild(particleContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDuration = `${5 + Math.random() * 5}s`;
        particle.style.opacity = Math.random();
        particleContainer.appendChild(particle);
    }
}

createParticles();
