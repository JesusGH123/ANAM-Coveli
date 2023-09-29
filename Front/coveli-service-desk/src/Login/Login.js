import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Container, Col, Row, Form, Button } from "react-bootstrap";
import Cookies from "universal-cookie";

import { API_BASE_URL } from "../constants.js";

import './Login.css';

function sendPasswordLink(email) {
  if(email == "")
    alert("Ingresa un correo");
  else {
    axios.post(
      `${API_BASE_URL}/users/forgotPassword`,
    {
      email
    }).then((res) => {      
      if(res["data"] == -1)
        alert("Usuario no existente");
      else
        alert("Revisa tu correo para actualizar la contraseña");
    })
  } 
}

function sendLogEvent(userId, message) {
  axios.post(
    `${API_BASE_URL}/users/event`,
    {
      userId: userId,
      message: message
    }
  )
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(true);
  const [message, setMessage] = useState("");
  const cookies = new Cookies();

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationConfig = {
      method: "post",
      url: `${API_BASE_URL}/users/userValidate`,
      data: {
        email: email,
        password: password,
      }
    }

    axios(validationConfig)
      .then((valResult) => {
        if(valResult.data["@p_result"] == 1) {
          cookies.set("USER_TOKEN", valResult.data["@p_userid"], {
            path: "/",
          });

          let authConfig = {
            method: "post",
            url: `${API_BASE_URL}/users/user/getViews`,
            data: {
              role: valResult.data["@p_roleid"]
            }
          }

          axios(authConfig)
            .then((authResult) => {  
                sendLogEvent(valResult.data["@p_userid"], "Inicio de sesión");
                window.location.href = `${authResult.data[0]["path"]}/${cookies.get("USER_TOKEN")}`;
            })
        } 
        else {
          setMessage(valResult.data["@p_message"]);
          setLogin(0);
        }
      })
      .catch((error) => {
        alert(error)
      })
  }

  return (
    <Container className="containerLogin">
      <Row className="rowLogin">
        <Col className="d-none d-lg-block" lg={8}>
          <Image id="loginImg" src="https://facturama.mx/blog/wp-content/uploads/2022/03/anam-agencia-aduanera-sat-1024x631.png" alt="logo"></Image>
        </Col>

        <Col className="spacedContainer" lg={3}>
          <h1>Iniciar sesi&oacute;n</h1>
          <hr></hr>

          <Form onSubmit={(e) => {
            if(email != "" && password != "") handleSubmit(e)
            else alert("Es necesario ingresar correo y contraseña")
          }}>
            <Form.Label for="email">Usuario</Form.Label>
            <Form.Control
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Form.Label for="password">Contrase&ntilde;a</Form.Label>
            <Form.Control 
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            { login != "" ? (<></>) : (<p className="alertMessage">{message}</p>) }
            
            <a id="forgot-password-a" onClick={() => sendPasswordLink(email) }>Olvid&eacute; mi contrase&ntilde;a</a>
            <Button className="btnLogin" type="submit">Iniciar sesi&oacute;n</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}