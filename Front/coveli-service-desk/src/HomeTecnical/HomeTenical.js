import { useState, useEffect } from 'react';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, Row, Container, Nav, Navbar, Table, Button, Modal, NavDropdown, Form} from "react-bootstrap";
import Cookies from "universal-cookie";
import axios from "axios";
import { API_BASE_URL } from '../constants.js';

import './HomeTecnical.css'

const cookies = new Cookies();

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

export default function HomeTecnical(){
    let CancelToken = axios.CancelToken;
    let cancelTokenSource = CancelToken.source();

    const [info, setInfo] = React.useState({
        "tickets_without_attendance": 0,
        "paused_tickets": 0,
        "closed_tickets": 0,
        "on_revision_tickets": 0,
        "my_tickets": []
    });
    const [username, setUsername] = React.useState("");
    const [useremail, setUseremail] = React.useState("");

    useEffect(() => {
        axios.get(`${API_BASE_URL}/home/getTechnicalHome/${cookies.get("USER_TOKEN")}`, { cancelToken: cancelTokenSource.token })
            .then((res) => {
                setInfo(res.data);
            }).catch((err) => handleError(err));
        axios.get(`${API_BASE_URL}/users/user/${cookies.get("USER_TOKEN")}`, {cancelToken: cancelTokenSource.token, mode: 'cors'})
            .then((res) => {
                setUseremail(res.data["EMAIL"]);
                setUsername(res.data["FULLNAME"]);
            }).catch((err) => handleError(err));
    });

    const [show, setShow] = React.useState(false);
    const [modalType, setModalType] = React.useState(0);
    const [currentTicket, setCurrentTicket] = React.useState({});
    const handleClose = () => setShow(0);
    const handleShow = () => setShow(true);
    const [comment, setComment] = useState("");
    const onChange = (event) => {
        setComment(event.target.value);
    }

    const updateTicket = (newStatus, comment) => {
        axios.put(`${API_BASE_URL}/home/ticket`, {
            userId: cookies.get("USER_TOKEN"),
            ticketId: currentTicket.ticketId,
            statusId: newStatus,
            comment: comment,
            technicalId: currentTicket.technicalId,
        })

        setComment("");
    }

    const logout = () => {
        cookies.remove("USER_TOKEN", {path: "/"});
        window.location.href = "/";
    }

    return(
        <div>    
            <div>
            <Navbar expand="md" className="bg-body-tertiary">
                <Container id='containerNav'>
                    <Navbar.Brand><img className="imgNav" alt="LTP Global Software" src="/images/logo.png" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/home" onClick={() => {cancelTokenSource.cancel('Operation canceled')}} style={{fontWeight:'bold'}}>Home</Nav.Link>
                        </Nav>                         
                        <div>
                            <Row>
                                <Col>
                                <img src='/images/user.png' style={{width:'2.5rem', height:'2.5rem'}}></img>
                                </Col>
                                <Col>
                                    <NavDropdown title={username} id="basic-nav-dropdown" style={{textAlign:'right', fontWeight:'bold'}} drop='down-centered'>
                                        <NavDropdown.Item onClick={() => { cancelTokenSource.cancel('Operation canceled'); logout()}}>Cerrar Sesión</NavDropdown.Item>                            
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
            </div>               
            
            <Row className="rowTecnical">
                <Col>
                    <div className="dashboardButton">
                        <Row>
                            <Col xs={8} style={{fontSize:'1.2rem'}} >
                                Tickets sin atender
                                <h2 style={{ fontSize:'4rem'}}>{info["tickets_without_attendance"]}</h2>
                            </Col>
                            <Col xs={1} >
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3} style={{marginTop:"1rem"}} >                                
                                <img className="imgInformation" src="/images/informacion.png"></img>
                            </Col>
                        </Row>                
                    </div>
                </Col>
                <Col>
                    <div className="dashboardButton">
                        <Row>
                            <Col xs={8} style={{fontSize:'1.2rem'}} >
                                Tickets pausados
                                <h2 style={{ fontSize:'4rem'}}>{info["paused_tickets"]}</h2>
                            </Col>
                            <Col xs={1}>
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3} style={{marginTop:"1rem"}} >                                
                                <img className="imgInformation" src="/images/boton-de-pausa-de-video.png"></img>
                            </Col>
                        </Row>                                        
                    </div>
                </Col>
            </Row>
            <Row className="rowTecnical">                    
                <Col>
                    <div className="dashboardButton">
                        <Row>
                            <Col xs={8} style={{fontSize:'1.2rem'}} >
                                Tickets cerrados
                                <h2 style={{ fontSize:'4rem'}}>{info["closed_tickets"]}</h2>
                            </Col>
                            <Col xs={1}>
                                <div className="divSeparator"></div>
                            </Col>                            
                            <Col xs={3} style={{marginTop:"1rem"}} >                                
                                <img className="imgInformation" src="/images/marca-de-verificacion.png"></img>
                            </Col>
                        </Row>         
                    </div>                                                   
                </Col>
                <Col>
                    <div className="dashboardButton">
                        <Row>
                            <Col xs={8} style={{fontSize:'1.2rem'}} >
                                Tickets con petición de cierre
                                <h2 style={{ fontSize:'4rem'}}>{info["on_revision_tickets"]}</h2>
                            </Col>
                            <Col xs={1}>
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3} style={{marginTop:"1rem"}} >                                
                                <img className="imgInformation" src="/images/detener.png"></img>
                            </Col>
                        </Row>                        
                    </div>
                </Col>
            </Row>   
            <Row>
                <Col>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Situación</th>
                            <th>Cliente</th>
                            <th>Fecha Solicitud</th>
                            <th>Prioridad</th>
                            <th>Estatus</th>
                        </tr>
                    </thead>
                    <tbody>
                        { info["my_tickets"].map((ticket) => {
                            return (
                                <tr>
                                    <td>{ticket.ticketId}</td>
                                    <td>{ticket.situation}</td>
                                    <td>{ticket.fullName}</td>
                                    <td>{ticket.currentDate}</td>
                                    <td>{ticket.priority}</td>
                                    { 
                                        (ticket.statusId == 9) ?
                                            <td>Cerrado</td>
                                        :
                                            (ticket.statusId == 7) ?
                                                <td>En revisión</td>
                                                :
                                                (ticket.statusId == 6) ? 
                                                <td>
                                                    <Button onClick={() => {
                                                        setModalType(3);
                                                        handleShow();
                                                        setCurrentTicket(ticket);
                                                    }} variant='warning' style={{borderRadius:20}}>Retomar</Button>
                                                    <Button onClick={() => {
                                                        setModalType(1);
                                                        handleShow();
                                                        setCurrentTicket(ticket);
                                                    }} variant='secondary' style={{borderRadius:20}}>Cerrar</Button>
                                                </td>
                                                :
                                                <td>
                                                    <Button onClick={() => {
                                                        setModalType(2);
                                                        handleShow();
                                                        setCurrentTicket(ticket);
                                                    }} variant='warning' style={{borderRadius:20}}>Pausar</Button>
                                                    <Button onClick={() => {
                                                        setModalType(1);
                                                        handleShow();
                                                        setCurrentTicket(ticket);
                                                    }} variant='secondary' style={{borderRadius:20}}>Cerrar</Button>
                                                </td>
                                    }
                                </tr>
                            )
                        })}     
                    </tbody>
                </Table>
                
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className='ms-auto'>Ticket: {currentTicket.ticketId}</Modal.Title>
                    </Modal.Header>
                    {
                        (modalType == 1) ?
                        <Row className='rowTecnical'>
                            <Modal.Body>
                                <Form>
                                    <Col lg={3}>
                                        Fotografia preliminar
                                    </Col>
                                    <Col lg={9}>
                                    <Form.Group controlId="formFileMultiple" className="mb-3">
                                        <Form.Control type="file" multiple/>
                                    </Form.Group>
                                    </Col>
                                    <Col lg={3}>
                                        Fotografia terminación
                                    </Col>
                                    <Col lg={9}>
                                    <Form.Group controlId="formFileMultiple" className="mb-3">
                                        <Form.Control type="file" multiple/>
                                    </Form.Group>
                                    </Col>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Comentario</Form.Label>
                                        <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => onChange(e)} />
                                    </Form.Group>
                                
                                    <Button variant="primary" onClick={handleClose}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" onClick={ (event) => {
                                        handleClose();
                                        updateTicket(7, comment);
                                        }}
                                        style={{margin:'1rem'}}>
                                        Solicitar cierre
                                    </Button>
                                </Form>
                            </Modal.Body>
                        </Row>
                            :
                            (modalType == 2) ?
                            <>
                                <Modal.Body>
                                    ¿Estas seguro de que deseas pausar el ticket?
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Motivo</Form.Label>
                                        <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => onChange(e)}/>
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" onClick={() => {
                                        handleClose();
                                        updateTicket(6, comment);
                                    }}>
                                        Pausar ticket
                                    </Button>
                                </Modal.Footer>                               
                            </>
                            :
                            <>
                                <Modal.Body>
                                    ¿Deseas retomar el ticket?
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Motivo</Form.Label>
                                        <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => onChange(e)}/>
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" onClick={() => {
                                        handleClose();
                                        updateTicket(5, comment);
                                    }}>
                                        Retomar ticket
                                    </Button>
                                </Modal.Footer>                               
                            </>
                    }
                </Modal>
                </Col>
            </Row>
        </div>        
    )
}