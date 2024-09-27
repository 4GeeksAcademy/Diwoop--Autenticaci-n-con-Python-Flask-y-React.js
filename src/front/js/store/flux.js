const getState = ({ getStore, getActions, setStore }) => {
  return {
      store: {
          listaDePersonajes: [],
          listaDePlanetas: [],
          planetasFavoritos:[],
          personajesFavoritos:[],
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
                  console.log("accessToken:", accessToken);
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
          checkLoginStatus: () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
              setStore({ isLoggedIn: true });
            } else {
              setStore({ isLoggedIn: false });
            }
          },
          logout: () => {
            localStorage.removeItem("accessToken");
            setStore({
              isLoggedIn: false,
            });
          },

          traerFavoritos: async () =>{
            const store = getStore();
            const accessToken = localStorage.getItem("accessToken");

            try {
              const response = await fetch("https://ubiquitous-giggle-wr74qgqjgg9vhggpw-3001.app.github.dev/api/users/favorites", {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              });

              console.log("Estado de la respuesta:", response.status);
              if (response.ok) {
                const data = await response.json();
                console.log("Datos recibidos del servidor:", data);
                const favorite_planets = data.favorite_planets;
                const favorite_people = data.favorite_people;
                setStore({
                  planetasFavoritos: favorite_planets,
                  personajesFavoritos: favorite_people,
                });
                console.log("planetas favoritos guardados:", favorite_planets);
                console.log("personajes favoritos guardados:", favorite_people);
                return true;
              } else {
                const errorResponse = await response.json();
                console.error("Error al obtener los favoritos del usuario:", errorResponse);
                return false;
              }
            } catch (error) {
              console.error("Error en la solicitud:", error);
              return false;
            }
          },
          addPlanetToFavorites: async (planet_id) => {
            return getActions().addToFavorites('planet', planet_id);
          },
          
          addPeopleToFavorites: async (people_id) => {
            return getActions().addToFavorites('people', people_id);
          },

         addToFavorites: async (type, id) => {
            const accessToken = localStorage.getItem("accessToken");
          
            try {
              const response = await fetch(`https://ubiquitous-giggle-wr74qgqjgg9vhggpw-3001.app.github.dev/api/favorite/${type}/${id}`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              });
          
              if (response.ok) {
                const userFavorites = await response.json();          
                if (userFavorites && userFavorites.favorite_planets && userFavorites.favorite_people) {
                  setStore({
                    planetasFavoritos: userFavorites.favorite_planets,
                    personajesFavoritos: userFavorites.favorite_people,
                  });
                } else {
                  console.error(`Formato inesperado en la respuesta al añadir ${type} a favoritos`);
                  return false;
                }
                return true;
              } else {
                console.error(`Error al añadir el ${type} a favoritos`);
                return false;
              }
            } catch (error) {
              console.error("Error en la solicitud:", error);
              return false;
            }
          },
            removeFromFavorites : async (type, id) => {
            const accessToken = localStorage.getItem("accessToken");
          
            try {
              const response = await fetch(`https://ubiquitous-giggle-wr74qgqjgg9vhggpw-3001.app.github.dev/api/favorite/${type}/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              });
          
              if (response.ok) {
                const userFavorites = await response.json();          
                if (userFavorites && userFavorites.favorite_planets && userFavorites.favorite_people) {
                  setStore({
                    planetasFavoritos: userFavorites.favorite_planets,
                    personajesFavoritos: userFavorites.favorite_people,
                  });
                } else {
                  console.error(`Formato inesperado en la respuesta al eliminar ${type} de favoritos`);
                  return false;
                }
                return true;
              } else {
                console.error(`Error al eliminar el ${type} de favoritos`);
                return false;
              }
            } catch (error) {
              console.error("Error en la solicitud:", error);
              return false;
            }
          },
          
          removePlanetFromFavorites: async (planet_id) => {
            return getActions().removeFromFavorites('planet', planet_id);
          },

          removePeopleFromFavorites: async (people_id) => {
            return getActions().removeFromFavorites('people', people_id);
          },
      }
  };
};

export default getState;
