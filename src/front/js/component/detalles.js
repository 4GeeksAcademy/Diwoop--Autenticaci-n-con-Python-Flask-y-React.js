import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/detalles.css"

export const Detalles = () => {
    const { type, id } = useParams();
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (store.listaDePersonajes.length === 0) {
            actions.traerPersonajes();
        }
        if (store.listaDePlanetas.length === 0) {
            actions.traerPlanetas();
        }
    }, []);

    const personajes = store.listaDePersonajes;
    const planetas = store.listaDePlanetas;
    
    const personaje = personajes.find((elemento) => elemento.id === parseInt(id));
    const planeta = planetas.find((elemento) => elemento.id === parseInt(id));
    const imageUrl = type === "personajes" ? personaje?.imageUrl : planeta?.imageUrl;


    return (
        <div className="body  container-fluid">
            <div className="card border border-warning p-3  w-75 d-flex flex-row justify-content-around">
                
                <div className="m-4 d-flex align-items-center">
                    <img src={imageUrl} className="card-img-top" style={{ width: "19rem", margin:"auto" }} alt="cargando..." />
                </div>
                 
                <div className="m-5 d-flex flex-column justify-content-center">
                    <h1 className="card-text text-light">
                        {type === "personajes" ? personaje?.name : planeta?.name}
                    </h1>
                    <p className="card-text text-light">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry
                    </p>
                    <div className="card-text text-light border border-warning p-4">
                        {type === "personajes" && personaje && (
                            <>
                                <p><strong>Name:</strong> {personaje.name}</p>
                                <p><strong>Birth year:</strong> {personaje.birthYear}</p>
                                <p><strong>Gender:</strong> {personaje.gender}</p>
                                <p><strong>Height:</strong> {personaje.height}</p>
                                <p><strong>Skin color:</strong>  {personaje.skinColor}</p>  
                                <p><strong>Eye color:</strong> {personaje.eyeColor}</p>
                                <p><strong>Hair color:</strong> {personaje.hairColor}</p>   
                            </>
                        )}
                        {type === "planetas" && planeta && (
                            <>
                                <p><strong>Name:</strong> {planeta.name}</p>
                                <p><strong>Climate:</strong> {planeta.climate}</p>
                                <p><strong>Population:</strong> {planeta.population}</p>
                                <p><strong>Orbital period:</strong> {planeta.orbitalPeriod}</p>
                                <p><strong>Rotation period:</strong> {planeta.rotationPeriod}</p>
                                <p><strong>Diameter:</strong> {planeta.diameter}</p>
                            </>
                        )}
                    </div>

                </div>
                
            </div>
        </div>
    );
};