import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";


export const SignUp = () => {
  const [user_name, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const registered = await actions.createUser(user_name, email, password);
    if (registered) {
      navigate("/login");
    } else {
      return "Error al crear el usuario. Por favor, intenta de nuevo.";
    }
  };

  return (
    <main className="main-container"> 
      <h1 className="text-center">SIGN UP</h1>
      <form onSubmit={onSubmitHandler}>
        <div className="container">
          <div className="mb-3 input-container">
            <input
              value={user_name}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              className="form-control input"
              id="inputUserName"
              placeholder="Nombre de usuario"
            />
          </div>
          <div className="mb-3 input-container">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="form-control input"
              id="inputEmail"
              placeholder="Email"
            />
          </div>
          <div className="mb-3 input-container">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control input"
              id="inputPassword"
              placeholder="Contraseña"
            />
          </div>
          <div className="text-center m-1">
            <button type="submit" className="btn btn-primary">
              Registrarse
            </button>
          </div>
          {store.error && <div className="text-danger text-center">{store.error}</div>}
        </div>
      </form>
    </main>
  );
};