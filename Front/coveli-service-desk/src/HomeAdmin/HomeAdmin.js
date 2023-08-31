import { useState, useEffect } from 'react';
import axios from "axios";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, Row, Container, Nav, Navbar, Table, Button, Modal, NavDropdown, Form} from "react-bootstrap";
import Cookies from "universal-cookie";
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../constants.js';

import './HomeAdmin.css'

const cookies = new Cookies();

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

export default function HomeAdmin(){
    const CancelToken = axios.CancelToken
    const cancelTokenSource = CancelToken.source()

    const [info, setInfo] = React.useState({
        "tickets_without_attendance": 0,
        "paused_tickets": 0,
        "closed_tickets": 0,
        "on_revision_tickets": 0,
        "all_tickets": []
    });
    const [username, setUsername] = React.useState("");
    const [useremail, setUseremail] = React.useState("");

    useEffect(() => {
        axios.get(`${API_BASE_URL}/home/getAdminHome/${cookies.get("USER_TOKEN")}`, { cancelToken: cancelTokenSource.token })
            .then((res) => {
                setInfo(res.data);
            })
            .catch((err) => handleError(err));
        axios.get(`${API_BASE_URL}/users/user/${cookies.get("USER_TOKEN")}`, {cancelToken: cancelTokenSource.token, mode: 'cors'})
            .then((res) => {
                setUseremail(res.data["EMAIL"]);
                setUsername(res.data["FULLNAME"]);
            })
            .catch((err) => handleError(err));
    });

    const [currentTicket, setCurrentTicket] = useState({});
    const [comment, setComment] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const logout = () => {
        cookies.remove("USER_TOKEN", {path: "/"});
        window.location.href = "/";
    }
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

    const ticketAction = async (action) =>{
        //6 Pausar
        //9 Cerrar
        let actionString = (action == 9) ? ["cerrar", "cerrado"] : ["pausar", "pausado"];

        Swal.fire({
            title: `¿Deseas ${actionString[0]} el ticket ${currentTicket.ticketId}?`,
            input: 'textarea',
            inputLabel: `Motivo`,
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: actionString[0].charAt(0).toUpperCase() + actionString[0].substring(1, actionString[0].length) ,
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
                updateTicket(action, comment);
            },
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: `Ticket ${actionString[1]}`,
              })
            }
          })
    };

    return(
        <div>    
            <div>
            <Navbar expand="md" className="bg-body-tertiary">
                <Container id='containerNav'>
                    <Navbar.Brand><img className="imgNav" alt="LTP Global Software" src="/images/logo.png" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/homeA" onClick={() => {cancelTokenSource.cancel('Operation canceled')}}style={{fontWeight:'bold'}}>Home</Nav.Link>
                            <Nav.Link href="/users" onClick={() => {cancelTokenSource.cancel('Operation canceled')}}style={{fontWeight:'bold'}}>Usuarios</Nav.Link>
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
            </div>               
            
            <Row className="rowAdmin">
                <Col>
                    <div className="dashboardButton">
                        <Row>
                            <Col xs={8} style={{fontSize:'1.2rem'}} >
                                Todos los tickets
                                <h2 style={{ fontSize:'4rem'}}>{info["all_tickets_count"]}</h2>
                            </Col>
                            <Col xs={1} >
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3} style={{marginTop:"1rem"}} >                                
                                <img className="imgInformation" src="/images/ticket.png"></img>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col>
                    <div className="dashboardButton">
                        <Row>
                            <Col xs={8} style={{fontSize:'1.2rem'}} >
                                Tickets sin asignar
                                <h2 style={{ fontSize:'4rem'}}>{info["not_assigned_tickets_count"]}</h2>
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
                <Col>
                    <div className="dashboardButton">
                        <Row>
                            <Col xs={8} style={{fontSize:'1.2rem'}} >
                                Generador de reporte                                
                            </Col>
                            <Col xs={1}>
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3} style={{marginTop:"1rem"}} >                                
                                <img className="imgInformation" src="/images/archivo.png"></img>
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
                                Tickets asignados
                                <h2 style={{ fontSize:'4rem'}}>{info["assigned_tickets_count"]}</h2>
                            </Col>
                            <Col xs={1}>
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
                                <h2 style={{ fontSize:'4rem'}}>{info["paused_tickets_count"]}</h2>
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
                <Col>
                    <div className="dashboardButton">
                        <Row>
                            <Col xs={8} style={{fontSize:'1.2rem'}} >
                                Tickets cerrados
                                <h2 style={{ fontSize:'4rem'}}>{info["closed_tickets_count"]}</h2>
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
                            <th>Técnico</th>
                            <th style={{textAlign:"center"}}>Pausar/Cerrar ticket</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        {
                            info["all_tickets"].map((ticket) => {
                                return (
                                    <tr>
                                        <td>{ticket.ticketId}</td>
                                        <td>{ticket.situation}</td>
                                        <td>{ticket.client}</td>
                                        <td>{ticket.openDate}</td>
                                        <td>{ticket.priority}</td>
                                        <td>{ticket.technical}</td>
                                        { (ticket.statusid == 9) ?
                                            <td style={{textAlign:"center"}}>Cerrado</td>
                                            :
                                                (ticket.statusid == 7) ?
                                                    <td style={{textAlign:"center"}}>
                                                        <Button onClick={() => {
                                                            setCurrentTicket(ticket);
                                                            ticketAction(6)
                                                            }} variant='warning' style={{borderRadius:20}}>Pausar</Button>
                                                        <Button  onClick={() => {
                                                            setCurrentTicket(ticket);
                                                            ticketAction(9)
                                                        }}variant='secondary'style={{borderRadius:20}}>Cerrar</Button>
                                                    </td>
                                                :
                                                <td style={{textAlign:"center"}}>{ticket.status}</td>
                                        }
                                    </tr>
                                )
                            })
                        }                     
                    </tbody>
                </Table>                    
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className='ms-auto'>Ticket: {currentTicket.ticketId}</Modal.Title>
                    </Modal.Header>
                    {
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
                                        }}
                                        style={{margin:'1rem'}}>
                                        Solicitar cierre
                                    </Button>
                                </Form>
                            </Modal.Body>
                        </Row>
                    }
                </Modal>
        </div>        
    )
}