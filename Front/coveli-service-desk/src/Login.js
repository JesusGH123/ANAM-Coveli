import React, { useState } from "react";
import axios from "axios";

import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    const configuration = {
      method: "get",
      url: `http://localhost:3001/users/user/${email}`
    }

    axios(configuration)
      .then((result) => {
        console.log(password + " == " + result.data.password);
        if(password == result.data.password)
          setLogin(true)
        else
          setLogin(false)
      })
      .catch((error) => {
        alert("Not registered user")
      })
  }

  return (
    <div>
      <img src="https://facturama.mx/blog/wp-content/uploads/2022/03/anam-agencia-aduanera-sat-1024x631.png"></img>
      <h1>Iniciar sesi&oacute;n</h1>

      <form onSubmit={(e) => handleSubmit(e)}>
        <label for="email">Usuario</label>
        <input 
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label for="password">Contrase&ntilde;a</label>
        <input 
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {login ? (<></>) : (<p className="LoginError">Usuario o contrase&ntilde;a incorrecta</p>)}
        <button type="submit" onClick={(e) => handleSubmit(e)}>Iniciar sesi&oacute;n</button>
      </form>

      <a href="">Olvid&eacute; mi contrase&ntilde;a</a>
    </div>
  );
}

export default Login;