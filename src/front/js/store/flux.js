const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            listaDePersonajes: [],
            listaDePlanetas: [],
            listaDeFavoritos: []
        },
        actions: {
            traerPersonajes: async () => {
                try {
                    const result = await fetch("https://ubiquitous-giggle-wr74qgqjgg9vhggpw-3001.app.github.dev/api/people");
                    const data = await result.json();
                    console.log("data:", data);
                    
                    const personajesDetalles = data.map(personaje => ({
                        id: personaje.id,
                        name: personaje.name,
                        gender: personaje.gender,
                        eyeColor: personaje.eye_color,
                        birthYear: personaje.birth_year,
                        height: personaje.height,
                        skinColor: personaje.skin_color,
                        imageUrl: personaje.image_url
                    }));
            
                    console.log("personajesDetalles:", personajesDetalles);
                    setStore({ listaDePersonajes: personajesDetalles });
                } catch (err) {
                    console.error(err);
                }
            },
            traerPlanetas: async () => {
                try {
                    const resultPlanet = await fetch("https://ubiquitous-giggle-wr74qgqjgg9vhggpw-3001.app.github.dev/api/planets");
                    const data = await resultPlanet.json();

                    const planetasDetalles = data.map(planeta => ({
                        id: planeta.id,
                        name: planeta.name,
                        diameter: planeta.diameter,
                        climate: planeta.climate,
                        population: planeta.population,
                        orbitalPeriod: planeta.orbital_period,
                        rotationPeriod: planeta.rotation_period,
                        imageUrl: planeta.image_url,
                    }));
                    setStore({ listaDePlanetas: planetasDetalles });
                } catch (err) {
                    console.error(err);
                }
            },
            addFavorites: (id, type, name, title) => {
                const { listaDeFavoritos } = getStore();
                const foundIndex = listaDeFavoritos.findIndex(
                    (element) => element.id === id && element.type === type
                );
                if (foundIndex !== -1) {
                    const newFavorites = listaDeFavoritos.filter(
                        (element, index) => index !== foundIndex
                    );
                    setStore({ listaDeFavoritos: newFavorites });
                } else {
                    const newFavorites = [...listaDeFavoritos, { id, type, name, title }];
                    setStore({ listaDeFavoritos: newFavorites });
                }
            },
            isInFavorites: (id, type) => {
                const { listaDeFavoritos } = getStore();
                return listaDeFavoritos.some(
                    (element) => element.id === id && element.type === type
                );
            },
        }
    };
};

export default getState;