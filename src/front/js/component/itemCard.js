import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/item.css";

export const ItemCard = ({ title, gender, eyeColor, type, id, imageUrl }) => {
  const { actions, store } = useContext(Context);
  const [isFavorited, setIsFavorited] = useState(false);

  // Función para verificar el estado de favoritos
  const checkFavoriteStatus = () => {
    console.log(`Verificando el estado de favoritos para el ítem con ID: ${id} y tipo: ${type}`);
    
    if (type === "personajes") {
      console.log("Verificando en la lista de personajes favoritos:", store.personajesFavoritos);
      const isFavoriteCharacter = store.personajesFavoritos.some((fav) => fav.id === id);
      console.log(`¿Está el personaje en favoritos? ${isFavoriteCharacter}`);
      setIsFavorited(isFavoriteCharacter);
    } else if (type === "planetas") {
      console.log("Verificando en la lista de planetas favoritos:", store.planetasFavoritos);
      const isFavoritePlanet = store.planetasFavoritos.some((fav) => fav.id === id);
      console.log(`¿Está el planeta en favoritos? ${isFavoritePlanet}`);
      setIsFavorited(isFavoritePlanet);
    }
  };

  useEffect(() => {
    console.log("useEffect llamado - Se ejecuta checkFavoriteStatus");
    checkFavoriteStatus();
  }, [store.personajesFavoritos, store.planetasFavoritos, id, type]);

  const handleFavoriteClick = async () => {
    console.log(`Clic en el botón de favoritos para el ítem con ID: ${id} y tipo: ${type}`);
    if (isFavorited) {
      console.log("El ítem ya está en favoritos, eliminando...");
      if (type === "personajes") {
        await actions.removePeopleFromFavorites(id);
      } else if (type === "planetas") {
        await actions.removePlanetFromFavorites(id);
      }
    } else {
      console.log("El ítem no está en favoritos, añadiendo...");
      if (type === "personajes") {
        await actions.addPeopleToFavorites(id);
      } else if (type === "planetas") {
        await actions.addPlanetToFavorites(id);
      }
    }
    setIsFavorited(!isFavorited);  // Cambia el estado después de añadir/eliminar
    console.log(`Nuevo estado de isFavorited: ${!isFavorited}`);
  };

  return (
    <div className="card m-6 p-3 border border-warning" style={{ width: "18rem" }}>
      <img
        src={imageUrl}
        className="card-img-top"
        alt="..."
        style={{ width: "100%", height: "300px", objectFit: "contain" }}
      />
      <div className="card-body">
        <h5 className="card-title text-warning">{title}</h5>
        {gender && <p className="card-text text-light">Gender: {gender}</p>}
        {eyeColor && <p className="card-text text-light">Eye color: {eyeColor}</p>}
      </div>
      <div className="d-flex justify-content-between m-2">
        <Link to={`/detalles/${type}/${id}`} className="btn btn-warning">
          See more
        </Link>
        <button onClick={handleFavoriteClick} className="btn btn-secondary">
          {isFavorited ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};
