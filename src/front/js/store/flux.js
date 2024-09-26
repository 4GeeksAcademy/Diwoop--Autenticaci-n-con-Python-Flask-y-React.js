const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            listaDePersonajes: [],
            listaDePlanetas: [],
            listaDeFavoritos: [],
            isLoggedIn: false,
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
            createUser: async (user_name, email, password) => {
                try {
                  if (!user_name || !email || !password) {
                    setStore({
                      error: "Todos los campos son requeridos",
                    });
                    return false;
                  }
            
                  const response = await fetch("https://ubiquitous-giggle-wr74qgqjgg9vhggpw-3001.app.github.dev/api/users", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      user_name,
                      email,
                      password,
                    }),
                  });
            
                  if (response.ok) {
                    const result = await response.json();
                    setStore({
                      is_active: true,
                      user: {
                        user_name,
                        email,
                      },
                      error: null,
                    });
                    return true;
                  } else {
                    const errorResult = await response.json();
                    console.error("Server Error:", errorResult);
                    setStore({
                      error: errorResult.msg || "Error desconocido",
                    });
                    return false;
                  }
                } catch (error) {
                  console.error("Network Error:", error);
                  setStore({
                    error: "Error al conectar con el servidor",
                  });
                  return false;
                }
              },

              login: async (email, password) => {
                const bodyData = {
                    email,
                    password,
                };
                try {
                    const res = await fetch("https://ubiquitous-giggle-wr74qgqjgg9vhggpw-3001.app.github.dev/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bodyData),
                    });

                    if (!res.ok) {
                    console.log("Error al hacer login", res.status);
                    return false;
                    }

                    const data = await res.json();
                    const accessToken = data.access_token;

                    if (accessToken) {
                    localStorage.setItem("accessToken", accessToken);
                    setStore({ isLoggedIn: true });
                    return true;
                    }
                    return false;
                } catch (error) {
                    console.log("Error al cargar mensaje del backend", error);
                    return false;
                }
                },
        }
    };
};

export default getState;