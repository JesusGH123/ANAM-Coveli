import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Container, Col, Row, Form, Button } from "react-bootstrap";
import Cookies from "universal-cookie";

import './Login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(true);
  const cookies = new Cookies();

  const handleSubmit = (e) => {
    e.preventDefault();

    const configuration = {
      method: "post",
      url: `http://localhost:3001/users/user/validate`,
      data: {
        email: email,
        password: password,
      }
    }

    axios(configuration)
      .then((result) => {
        if(result.data) {
          cookies.set("USER_TOKEN", result.data.token, {
            path: "/",
          });
          window.location.href = "/home";
        } else {
          setLogin(false);
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error)
      })
    }
  }

  return (
    <Container className="containerLogin">
      <Row className="rowLogin">
        <Col className="d-none d-lg-block" lg={8}>
          <Image id="loginImg"src="https://facturama.mx/blog/wp-content/uploads/2022/03/anam-agencia-aduanera-sat-1024x631.png" alt="logo"></Image>
        </Col>

        <Col lg={3}>
          <h1>Iniciar sesi&oacute;n</h1>
          <hr></hr>

          <Form onSubmit={(e) => handleSubmit(e)}>
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
            
            {login ? (<></>) : (<p className="alertMessage">Usuario o contrase&ntilde;a incorrecta</p>)}
            
            <a href="">Olvid&eacute; mi contrase&ntilde;a</a>
            <Button className="btnLogin" type="submit" onClick={(e) => handleSubmit(e)}>Iniciar sesi&oacute;n</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}