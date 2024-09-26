import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/item.css";

export const ItemCard = ({ title, gender, eyeColor, type, id, imageUrl  }) => {
 
  const { actions } = useContext(Context);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setIsFavorited(actions.isInFavorites(id, type));
  }, [id, type, actions]);

  const nuevoFavorito = () => {
    actions.addFavorites(id, type, title);
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="card m-6 p-3 border border-warning" style={{ width: "18rem" }}>
      <img src={imageUrl} className="card-img-top" alt="..." style={{ width: "100%", height: "300px", objectFit: "contain" }} />
      <div className="card-body">
        <h5 className="card-title text-warning">{title}</h5>
        {gender && <p className="card-text text-light">Gender: {gender}</p>}
        {eyeColor && <p className="card-text text-light">Eye color: {eyeColor}</p>}
      </div>
      <div className="d-flex justify-content-between m-2">
        <Link to={`/detalles/${type}/${id}`} className="btn btn-warning">
          See more
        </Link>
        <button onClick={nuevoFavorito} className="btn btn-secondary">{isFavorited ? '❤️' : '🤍'}</button>
      </div>
    </div>
  );
};
