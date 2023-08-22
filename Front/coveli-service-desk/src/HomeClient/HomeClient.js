import { useState } from 'react';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, Row, Container, Nav, Navbar, Table, Button, Modal,NavDropdown, Form, FormGroup} from "react-bootstrap";
import Cookies from "universal-cookie";
import Swal from 'sweetalert2';

import './HomeClient.css'


export default function HomeClient(){

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const logout = () => {
        const cookies = new Cookies();
        cookies.remove("USER_TOKEN", {path: "/"});
        window.location.href = "/";
    }

    const newClient = () => {
        const { value:category} = Swal.fire({
                title: 'Nuevo Ticket',
                input:'select',
                inputOptions:{
                    'Incidencia':'Incidencia',
                    'Siniestro':'Siniestro'
                },
                inputPlaceholder:'Seleccione Categoria',
                showCancelButton:true
            });
    };

    const saveClient = () =>{
        Swal.fire({
            icon: 'success',
            title: 'Correcto...',
            text: '¡Ticker guardado Correctamente!'            
          })

        handleClose();
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
                            <Nav.Link href="/home" style={{fontWeight:'bold'}}>Home</Nav.Link>
                        </Nav>                         
                        <div>
                            <Row>
                                <Col>
                                <img src='/images/user.png' style={{width:'2.5rem', height:'2.5rem'}}></img>
                                </Col>
                                <Col>
                                    <NavDropdown title="Client" id="basic-nav-dropdown" style={{textAlign:'right', fontWeight:'bold'}} drop='down-centered'>
                                        <NavDropdown.Item onClick={logout}>Cerrar Sesión</NavDropdown.Item>                            
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
            
            <Row>
                <Col lg={9}>                
                    <Button className='btn-new-client' onClick={handleShow}>
                        Nuevo ticket
                    </Button>
                </Col>
                <Col lg={3}>
                    <div className="dashboardButtonCliente">
                        <Row>
                            <Col xs={8} style={{fontSize:'1.2rem'}} >
                                Tickets Levantados
                                <h2 style={{ fontSize:'4rem'}}>2</h2>
                            </Col>
                            <Col xs={1}>
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3} style={{marginTop:"1rem"}} >                                
                                <img className="imgInformation" src="/images/ticket.png"></img>
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
                            <th>Validación</th>
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
                            <td><Button className='btn-save-client' onClick={saveClient}>Revisión</Button></td>                            
                        </tr>
                        <tr>
                            <td>12393</td>
                            <td>Rodillos</td>
                            <td>Cliente23</td>
                            <td>04/04/2023 01:50</td>
                            <td>Alta</td>
                            <td>Técnico</td>                            
                            <td><Button onClick={handleShow} variant='success' style={{borderRadius:20}}>Validar</Button><Button variant="danger"style={{borderRadius:20}}>No resuelto</Button></td>
                        </tr>                        
                    </tbody>
                </Table>

                    <Modal show={show} onHide={handleClose} style={{color:"#66CCC5"}}>
                        <Modal.Header closeButton>
                        <Modal.Title>Nuevo ticket</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <Row>
                                    <Col lg={5}>
                                        Categoría
                                    </Col>
                                    <Col lg={7}>                                        
                                        <Form.Select>
                                            <option></option>
                                            <option value="Incidencia">Incidencia</option>
                                            <option value="Siniestro">Siniestro</option>                                                
                                        </Form.Select>
                                    </Col>                                    
                                </Row>
                                <Row>
                                    <Col lg={5}>
                                        Situación
                                    </Col>
                                    <Col lg={7}>
                                        <Form.Control>
                                        </Form.Control>
                                    </Col>                                    
                                </Row>                               
                                <Row>
                                    <Col lg={5}>
                                        Modelo del Equipo
                                    </Col>
                                    <Col lg={7}>
                                        <Form.Select>
                                            <option></option>
                                            <option value="CX100100D">CX100100D</option>
                                            <option value="HI-PE PLUS ">HI-PE PLUS</option>                                                
                                            <option value={"FS6000"}>FS6000</option>
                                        </Form.Select>
                                    </Col>                                    
                                </Row>
                                <Row>
                                    <Col lg={5}>
                                        Ubicación del Equipo
                                    </Col>
                                    <Col lg={7}>
                                        <Form.Select>
                                            <option></option>
                                            <option value="AICM SEPOMEX (ENCOMIENDA)">AICM SEPOMEX (ENCOMIENDA)</option>
                                            <option value="AICM ADUANAS (ALMACEN 18)">AICM ADUANAS (ALMACEN 18)</option>                                                
                                            <option value="AICM ADUANAS (PLATAFORMA DE EXPORTACIÓN)">AICM ADUANAS (PLATAFORMA DE EXPORTACIÓN)</option>
                                            <option value="AICM SEPOMEX (Concentrados)">AICM SEPOMEX (Concentrados)</option>
                                            <option value="AICM ADUANAS (Acceso Peatonal)">AICM ADUANAS (Acceso Peatonal)</option>
                                            <option value="AIFA ADUANAS (ACCESO PEATONAL EXPORTACION)">AIFA ADUANAS (ACCESO PEATONAL EXPORTACION)</option>
                                            <option value="AIFA ADUANAS (ACCESO PEATONAL IMPORTACIÓN)">AIFA ADUANAS (ACCESO PEATONAL IMPORTACIÓN)</option>
                                            <option value="AIFA ADUANAS (CENTRAL)">AIFA ADUANAS (CENTRAL)</option>
                                            <option value="AIFA ADUANAS (IMPORTACION)">AIFA ADUANAS (IMPORTACION)</option>
                                            <option value="AIFA ADUANAS (EXPORTACION)">AIFA ADUANAS (EXPORTACION)</option>
                                            <option value="IMPORTACION TUNEL 1 (LADO AIRE)">IMPORTACION TUNEL 1 (LADO AIRE)</option>
                                            <option value="IMPORTACION TUNEL 2 (LADO BANQUETA)">IMPORTACION TUNEL 2 (LADO BANQUETA)</option>
                                            <option value="IMPORTACION TUNEL 3 (LADO AIRE)">IMPORTACION TUNEL 3 (LADO AIRE)</option>
                                            <option value="IMPORTACION TUNEL 4 (LADO AIRE)">IMPORTACION TUNEL 4 (LADO AIRE)</option>                                            
                                        </Form.Select>
                                    </Col>                                    
                                </Row>
                                <Row>
                                    <Col lg={5}>
                                        No. de Serie
                                    </Col>
                                    <Col lg={7}>
                                        <Form.Select>
                                            <option></option>
                                            <option value='TFNAP13220086'>TFNAP13220086</option>
                                            <option value='TFNAP13220087'>TFNAP13220087</option>
                                            <option value='TFNAP13220088'>TFNAP13220088</option>
                                            <option value='TFNAP13220089'>TFNAP13220089</option>
                                            <option value='TFNAP13220090'>TFNAP13220090</option>
                                            <option value='TFNAP13220091'>TFNAP13220091</option>
                                            <option value='TFNAP13220092'>TFNAP13220092</option>
                                            <option value='TFNAP13220093'>TFNAP13220093</option>
                                            <option value='TFNAP13220094'>TFNAP13220094</option>
                                            <option value='TFNAP13220095'>TFNAP13220095</option>
                                            <option value='TFNAP13220096'>TFNAP13220096</option>
                                            <option value='TFNAP13220097'>TFNAP13220097</option>
                                            <option value='TFNPA16220011'>TFNPA16220011</option>
                                            <option value='TFNPA16220012'>TFNPA16220012</option>
                                            <option value='31060420660'>31060420660</option>
                                            <option value='TFN EG-11699'>TFN EG-11699</option>
                                            <option value='TFN EG-11700'>TFN EG-11700</option>
                                            <option value='TFN EG-11701'>TFN EG-11701</option>
                                            <option value='TFN EG-11702'>TFN EG-11702</option>                                            
                                        </Form.Select>
                                    </Col>                                    
                                </Row>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        Comentarios
                                        <Form.Control as="textarea" rows={3} />
                                </Form.Group>
                                <Form.Label>Evidencias</Form.Label>
                                <Form.Control type="file" />
                                <Button className='btn-save-client' onClick={saveClient}>Guardar Ticket</Button>
                            </div>                            
                        </Modal.Body>                        
                    </Modal>
                </Col>
            </Row>
        </div>        
    )
}