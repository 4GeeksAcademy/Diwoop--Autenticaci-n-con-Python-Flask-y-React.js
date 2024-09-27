import React, { useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/entrar.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const logged = await actions.login(email, password);
    if (logged) {
      navigate(`/`);
    }
    else {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <main className="main-container w-50 m-auto">
      <h1 className="text-center text-warning">LOGIN</h1>
      <form onSubmit={onSubmitHandler}>
        <div className="container">
          <div className="mb-3 input-container">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
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
        </div>
        <div className="text-center m-1">
          <button type="submit" className="btn btn-warning">Login</button>
        </div>
      </form>
    </main>
  );
};