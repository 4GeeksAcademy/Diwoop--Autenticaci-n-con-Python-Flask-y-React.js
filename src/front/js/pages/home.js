import React, { useContext, useEffect } from "react";
import { ItemCard } from "../component/itemCard";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
    const {store, actions}= useContext(Context)
    const personajes = store.listaDePersonajes;

    useEffect(()=> {
        actions.traerPersonajes();
        actions.traerPlanetas();
    }, [])
    const planetas = store.listaDePlanetas;
       
    return (
        <div className= " body container-fluid">
            <h2 className="text-warning">Characters</h2>
            <div className="row mb-4">
                {personajes.map((elemento) => (
                    <ItemCard
                    key={elemento.id}
                    title={elemento.name}
                    gender={elemento.gender} 
                    eyeColor={elemento.eyeColor}
                    type="personajes"
                    id={elemento.id}
                    imageUrl={elemento.imageUrl}
                    />
                ))}
            </div>
            <h2 className="text-warning">Planets</h2>
            <div className="row">
             {planetas.map((elemento) => (
                    <ItemCard
                        key= {elemento.id}
                        title= {elemento.name}
                        terrain = {elemento.terrain}
                        population= {elemento.population}
                        type = "planetas"
                        id= {elemento.id}
                        imageUrl={elemento.imageUrl}
                    />)
             )}
            </div>
        </div>
    )
};