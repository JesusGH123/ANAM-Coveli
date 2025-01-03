import React from "react";
import { useState, useEffect, componentWillUnmount } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, Row, Container, Nav, Navbar, NavDropdown, Table, Button, Form, Modal } from "react-bootstrap";
import { API_BASE_URL } from '../constants.js';
import Cookies from "universal-cookie";
import Swal from 'sweetalert2';

import "./UsersView.css"
import NavigationBar from "../Navbar/Navbar";

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
    const [isAccesible, setIsAccesible] = React.useState(false); 

    const [users, setUsers] = React.useState([]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);  
    
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/users`, { cancelToken: cancelTokenSource.token })
            .then((res) => {
                setUsers(res.data);
            }).catch((err) => 
                handleError(err)
            )
    })

    useEffect(() => {
            axios.post(`${API_BASE_URL}/users/checkPermissions`, {
                userId: cookies.get("USER_TOKEN"),
                nextPath: '/users'
            }).then((res) => {
                if(res.data)
                    setIsAccesible(true)
                else
                    window.location.href = "/";
            })
            axios.get(`${API_BASE_URL}/users/roles`, { cancelToken: cancelTokenSource.token })
            .then((res) => setRoles(res.data))
            .catch((err) => handleError(err));
    }, []);

    return (
        <div>
            {
                (isAccesible) ?
                <div>
                    <NavigationBar/>

                    <Row>
                        <Col><h2>Cuentas</h2></Col>
                        <Col style={{marginTop: 10}} sm="3"><Button onClick={handleShow} variant="dark">Agregar usuario</Button></Col>
                    </Row>

                    <Row>
                        <Table style={{margin: 10}} striped bordered hover>
                            <thead id="tableHeader">
                                <tr>
                                    <Row>
                                        <Col xs="4"><th>Correo</th></Col>
                                        <Col xs="4"><th>Nombre</th></Col>
                                        <Col xs="1"><th>Rol</th></Col>
                                        <Col xs="3"><th></th></Col>
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
                                                    <Col sm="4"><td>{user["email"]}</td></Col>
                                                    <Col sm="4"><td>{user["fullName"]}</td></Col>
                                                    <Col sm="1"><td>{user["role"]}</td></Col>
                                                    <Col sm="3">
                                                        <td>
                                                            <Button style={{marginTop: 5}} onClick={() => launchSwal(["eliminar", "eliminado"], user["userId"], 3)} variant="dark">Eliminar</Button>
                                                            <Button style={{marginTop: 5}} onClick={() => launchSwal(["desactivar", "desactivado"], user["userId"], 2)} variant="dark">Desactivar</Button>
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
                :
                null
            }
        </div>
    )
}