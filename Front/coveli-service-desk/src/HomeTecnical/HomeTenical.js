import { useState } from 'react';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, Row, Container, Nav, Navbar, Table, Button, Modal,NavDropdown} from "react-bootstrap";
import Cookies from "universal-cookie";

import './HomeTecnical.css'


export default function HomeTecnical(){

    const cookies = new Cookies();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                            <Nav.Link href="/home" style={{fontWeight:'bold'}}>Home</Nav.Link>
                        </Nav>                         
                        <div>
                            <Row>
                                <Col>
                                <img src='/images/user.png' style={{width:'2.5rem', height:'2.5rem'}}></img>
                                </Col>
                                <Col>
                                    <NavDropdown title="Tecnical" id="basic-nav-dropdown" style={{textAlign:'right', fontWeight:'bold'}} drop='down-centered'>
                                        <NavDropdown.Item href="#action/3.1" onClick={logout}>Cerrar Sesión</NavDropdown.Item>                            
                                    </NavDropdown>                        
                                    <label style={{color:'#51177D'}}>
                                        isc_mbm@yahoo.com.mx
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
                                <h2 style={{ fontSize:'4rem'}}>67</h2>
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
                                <h2 style={{ fontSize:'4rem'}}>4</h2>
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
                                <h2 style={{ fontSize:'4rem'}}>140</h2>
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
                                <h2 style={{ fontSize:'4rem'}}>25</h2>
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
                            <th>Técnico</th>
                            <th>Estatus</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>02132</td>
                            <td>Banda del Equipo</td>
                            <td>Cliente01</td>
                            <td>01/06/2023 03:34</td>
                            <td>Alta</td>
                            <td>Técnico</td>
                            <td>Cerrado</td>                            
                        </tr>
                        <tr>
                            <td>12393</td>
                            <td>Rodillos</td>
                            <td>Cliente23</td>
                            <td>04/04/2023 01:50</td>
                            <td>Alta</td>
                            <td>Técnico</td>                            
                            <td><Button onClick={handleShow} variant='warning' style={{borderRadius:20}}>Pausar</Button><Button variant='secondary'style={{borderRadius:20}}>Cerrar</Button></td>
                        </tr>                        
                    </tbody>
                </Table>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title className='ms-auto'>Ticket: 23423</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <Row className='rowTecnical'>
                                    <Col lg={6}>
                                        Fotografia preliminar
                                    </Col>
                                    <Col lg={6}>
                                        <Button variant='primary'>Cargar imagen</Button>
                                    </Col>
                                    <Col lg={6}>
                                        Fotografia Terminación
                                    </Col>
                                    <Col lg={6}>
                                        <Button variant='primary'>Cargar imagen</Button>
                                    </Col>
                                </Row>                                
                                
                            </div>                            
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleClose} style={{margin:'1rem'}}>
                            Cerrar ticket
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        </div>        
    )
}