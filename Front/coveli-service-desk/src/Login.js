import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Image, Container, Col, Row, Form, Button} from "react-bootstrap";

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
        if(password === result.data.password)
          setLogin(true)
        else
          setLogin(false)
      })
      .catch((error) => {
        alert("Not registered user")
      })
  }

  return (
    <Container>
      <Row>
        <Col lg={8}>
          <Image src="https://facturama.mx/blog/wp-content/uploads/2022/03/anam-agencia-aduanera-sat-1024x631.png" alt="logo"></Image>
        </Col>

        <Col>
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
            
            {login ? (<></>) : (<p className="LoginError">Usuario o contrase&ntilde;a incorrecta</p>)}
            
            <a href="">Olvid&eacute; mi contrase&ntilde;a</a>
            <Button type="submit" onClick={(e) => handleSubmit(e)}>Iniciar sesi&oacute;n</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;