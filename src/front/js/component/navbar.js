import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
	const { store } = useContext(Context);
	const { listaDeFavoritos } = store;
	

	return (
		<nav className="navbar navbar-dark p-3">
			<img 
				src="https://purodiseno.lat/wp-content/uploads/2022/05/STAR-WARS-828x621.jpg" 
				className="img-fluid" 
				alt="Logo Star Wars"
				style={{ width: 130, height: 100 }}
			/>
			<h1 className="text-warning">Star Wars Blog</h1>
			<div className="btn-group p-3">
				<button type="button" className="btn btn-warning dropdown-toggle p-2" data-bs-toggle="dropdown" aria-expanded="false">
					Favorites <span className=" contador px-2 py-1">{listaDeFavoritos.length}</span>
				</button>
				<ul className="dropdown-menu p-10" style={{ textAlign: "left" }}>
				
					{listaDeFavoritos.length > 0 ? (
						listaDeFavoritos.map((favorito, index) => (
							
							<li key={index}>
								<Link to={`/detalles/${favorito.type}/${favorito.id}`} className="dropdown-item">
									{favorito.type === "personajes" ? `${favorito.name}` : `${favorito.name}`}
								</Link>
							</li>
						))
					) : (
						<li className="dropdown-item">No favorites</li>
					)}
				</ul>
			</div>
		</nav>
	);
};