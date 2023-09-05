import React, { useState, useEffect } from "react";
import axios from "axios";
import { Image, Container, Col, Row, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom"
import Swal from 'sweetalert2'

import { API_BASE_URL } from "../constants.js";

export default function ResetPassword() {
  const [tokenValid, setTokenValid] = useState(false);
  const [password2, setPassword2] = useState("");
  const [password1, setPassword1] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const params = useParams();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/users/validateToken/${params.key}`)
      .then((res) => {
        if(res["data"]) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          window.location.href = "/";
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`${API_BASE_URL}/users/updatePassword`, {
      token: params.key,
      password: password1
    })
    window.location.href = "/";
  }

  return (
    <Container className="containerLogin">
      {
        (tokenValid) ? 
        <Row className="rowLogin">
        <Col className="d-none d-lg-block" lg={8}>
          <Image id="loginImg" src="https://facturama.mx/blog/wp-content/uploads/2022/03/anam-agencia-aduanera-sat-1024x631.png" alt="logo"></Image>
        </Col>

        <Col lg={3}>
          <h3>Reestablecer contraseña</h3>
          <hr></hr>

          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Label for="password">Contrase&ntilde;a</Form.Label>
            <Form.Control
              id="password"
              name="password"
              type="password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />

            <Form.Label for="password2">Confirmar contrase&ntilde;a</Form.Label>
            <Form.Control 
              id="password2"
              name="password2"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            
            {passwordMatch ? (<></>) : (<p className="alertMessage">Las contrase&ntilde;as no coinciden</p>)}
            
            <a href="/reset">Olvid&eacute; mi contrase&ntilde;a</a>
            <Button className="btnLogin" type="submit" onClick={(e) => {
              if(password1 == password2 && (password1 != "" && password2 != ""))
                  handleSubmit(e)
              else
                  setPasswordMatch(false);
              }}>Cambiar contrase&ntilde;a</Button>
          </Form>
        </Col>
        </Row> : 
        <></>
    }
    </Container>
  );
}