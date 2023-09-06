import React from "react";
import { useState, useEffect, componentWillUnmount } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, Row, Container, Nav, Navbar, NavDropdown, Table, Button, Form, Modal } from "react-bootstrap";
import { API_BASE_URL } from '../constants.js';
import Cookies from "universal-cookie";
import Swal from 'sweetalert2';

import "./UsersView.css"

const cookies = new Cookies();

function generateRandomPassword() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&/()=?¡';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 10) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function launchSwal(messages, userId, actionId) {
    console.log("Making this action: " + actionId);
    console.log("To this user: " + userId);

    Swal.fire({
        title: `Desea ${messages[0]} el usuario`,
        showDenyButton: true,
        confirmButtonText: messages[0][0].toUpperCase() + messages[0].substring(1, messages[0].length),
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
            axios.put(`${API_BASE_URL}/users/user`, {
                p_userid: userId,
                p_statusid: 3,
            })
          Swal.fire(`Usuario ${messages[1]} correctamente`)
        }
      })
}

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

export default function UserRegister() {
    let CancelToken = axios.CancelToken;
    let cancelTokenSource = CancelToken.source();

    const [username, setUsername] = React.useState("");
    const [useremail, setUseremail] = React.useState("");
    const [users, setUsers] = React.useState([]);
    const logout = () => {
        cookies.remove("USER_TOKEN", {path: "/"});
        window.location.href = "/";
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);  
    
    const [roles, setRoles] = useState([]);

    useEffect(() => {
            axios.get(`${API_BASE_URL}/users`, { cancelToken: cancelTokenSource.token })
            .then((res) => {
                console.log(res.data);
                setUsers(res.data);
            }).catch((err) => 
                handleError(err)
            )
            axios.get(`${API_BASE_URL}/users/user/${cookies.get("USER_TOKEN")}`, { cancelToken: cancelTokenSource.token, mode: 'cors' })
            .then((res) => {
                setUseremail(res.data["EMAIL"]);
                setUsername(res.data["FULLNAME"]);
            }).catch((err) => handleError(err))

            axios.get(`${API_BASE_URL}/users/roles`, { cancelToken: cancelTokenSource.token })
            .then((res) => setRoles(res.data))
            .catch((err) => handleError(err));
    },[]);

    return (
        <div>    
            <div>
            <Navbar expand="md" className="bg-body-tertiary">
                <Container id='containerNav'>
                    <Navbar.Brand><img className="imgNav" alt="LTP Global Software" src="/images/logo.png" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href={`/homeA/`} onClick={() => {cancelTokenSource.cancel('Operation canceled')}} style={{fontWeight:'bold'}}>Home</Nav.Link>
                            <Nav.Link href="/users" onClick={() => {cancelTokenSource.cancel('Operation canceled')}} style={{fontWeight:'bold'}}>Usuarios</Nav.Link>
                        </Nav>                         
                        <div>
                            <Row>
                                <Col>
                                <img src='/images/user.png' style={{width:'2.5rem', height:'2.5rem'}}></img>
                                </Col>
                                <Col>
                                    <NavDropdown title={username} id="basic-nav-dropdown" style={{textAlign:'right', fontWeight:'bold'}} drop='down-centered'>
                                        <NavDropdown.Item onClick={() => { cancelTokenSource.cancel('Operation canceled'); logout();}}>Cerrar Sesión</NavDropdown.Item>                            
                                    </NavDropdown>                        
                                    <label style={{color:'#51177D'}}>
                                        {useremail}
                                    </label>                        
                                </Col>
                            </Row>                        
                        </div>
                        
                    </Navbar.Collapse>
                    
                </Container>                        
            </Navbar>       

            <Row>
                <Col sm="10"><h2>Cuentas</h2></Col>
                <Col><Button onClick={handleShow} variant="dark">Agregar usuario</Button></Col>
            </Row>

            <Row>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <Row>
                                <Col sm="4"><th>Correo</th></Col>
                                <Col sm="4"><th>Nombre</th></Col>
                                <Col sm="1"><th>Rol</th></Col>
                                <Col sm="3"><th></th></Col>
                            </Row>
                        </tr>
                    </thead>
                    <tbody>
                        <tr> 
                            {
                                users.map((user) => {                                    
                                    return (
                                        (user["USERID"] != cookies.get("USER_TOKEN")) ?
                                        <Row>
                                            <Col sm="4"><td>{user["EMAIL"]}</td></Col>
                                            <Col sm="4"><td>{user["FULLNAME"]}</td></Col>
                                            <Col sm="2"><td>{user["ROLE"]}</td></Col>
                                            <Col sm="2">
                                                <td>
                                                    <Button onClick={() => launchSwal(["eliminar", "eliminado"], user["USERID"], 3)} variant="dark">Eliminar</Button>
                                                    <Button onClick={() => launchSwal(["desactivar", "desactivado"], user["USERID"], 2)} variant="dark">Desactivar</Button>
                                                </td>
                                            </Col>
                                        </Row>
                                        :
                                        null
                                    )
                                })
                            }
                        </tr>
                    </tbody>
                </Table>
            </Row>

            <Modal show={show} onHide={handleClose} style={{color:"#66CCC5"}}>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>                    
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">Nombre</Form.Label>
                            <Col sm="10"><Form.Control id="inputName" type="text"/></Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">Correo</Form.Label>
                            <Col sm="10"><Form.Control id="inputEmail" type="email"/></Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="2">Rol</Form.Label>
                            <Col sm="10">
                                <Form.Select id="inputRole" aria-label="Default select example">
                                    <option>-</option>
                                    {
                                        roles.map((role) => {
                                            return (<option value={role["roleId"]}>{role["role"]}</option>)
                                        })
                                    }
                                </Form.Select>
                            </Col>
                        </Form.Group>
                        <Button onClick={() => {
                            axios.post(`${API_BASE_URL}/users/addUser`, {
                                p_fullname: document.getElementById("inputName").value,
                                p_email: document.getElementById("inputEmail").value,
                                p_password: generateRandomPassword(),
                                p_roleid: document.getElementById("inputRole").value,
                            }).then(() => {
                                //Successful creation
                            }).catch((e) => {
                                alert(e);
                            });
                            handleClose();
                        }}>Agregar usuario</Button>
                    </Form>
                </Modal.Body>                        
            </Modal>                            
            </div>
        </div>
    )
}