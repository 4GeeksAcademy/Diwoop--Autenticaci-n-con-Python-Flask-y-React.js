import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
	const { store } = useContext(Context);
	const { listaDeFavoritos } = store;

	return (
		<nav className="navbar navbar-dark p-3">
			<div className="d-flex justify-content-between w-100 align-items-center">
				<div className="">
					<img 
					src="https://purodiseno.lat/wp-content/uploads/2022/05/STAR-WARS-828x621.jpg" 
					className="img-fluid" 
					alt="Logo Star Wars"
					style={{ width: 130, height: 100 }}
					/>
				</div>
				<div className="">
					<h1 className="text-warning  text-center">Star Wars Blog</h1>
				</div>			
			{store.isLoggedIn ? (
				<div className="btn-group p-3">
					<button type="button" className="btn btn-warning dropdown-toggle p-2 " data-bs-toggle="dropdown" aria-expanded="false">
						Favorites <span className="contador px-2 py-1">{listaDeFavoritos.length}</span>
					</button>
					<ul className="dropdown-menu p-3" style={{ textAlign: "left" }}>
						{listaDeFavoritos.length > 0 ? (
							listaDeFavoritos.map((favorito, index) => (
								<li key={index}>
									<Link to={`/detalles/${favorito.type}/${favorito.id}`} className="dropdown-item">
										{favorito.name}
									</Link>
								</li>
							))
						) : (
							<li className="dropdown-item">No favorites</li>
						)}
					</ul>
				</div>
			) : (
				<div className=" justify-content-end">
				<Link to="/signup">
				<button type="button" className="btn btn-warning p-2 m-3">
					Signup
				</button>
				</Link>

				<Link to="/login">
				<button type="button" className="btn btn-warning p-2 m-3">
					Login
				</button>
				</Link>
				</div>
			)}
			</div>
		</nav>
	);
};
