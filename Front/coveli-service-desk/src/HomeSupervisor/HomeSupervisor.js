import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table, Image, Navbar, Container, Nav, Row, Col, NavDropdown } from "react-bootstrap";
import Cookies from "universal-cookie";
import './HomeSupervisor.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

export default function HomeSupervisor() {
    const cookies = new Cookies();
    const logout = () => {
        cookies.remove("USER_TOKEN", {path: "/"});
        window.location.href = "/";
    }

    return (
        <Container className="containerLogin">
            <Navbar className="bg-body-tertiary" expand="lg" >
                <Container id="navContainer">
                    <Navbar.Brand><img id="logoImg" alt="Ltp global software" src="/images/logo.png"/></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                    </Nav>
                    <div>
                        <Row>
                            <Col>
                            <img src='/images/user.png' style={{width:'2.5rem', height:'2.5rem'}}></img>
                            </Col>
                            <Col>
                                <NavDropdown title="Tecnical" id="basic-nav-dropdown" style={{textAlign:'right', fontWeight:'bold'}} drop='down-centered'>
                                    <NavDropdown.Item onClick={logout}>Cerrar sesi&oacute;n</NavDropdown.Item>                            
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

            <Row className="rowHomeSupervisor">
                <Col>
                    <div className="dashboardButton">
                        <Row className="rowHomeSupervisor">
                            <Col xs={8}>
                                Tickets totales
                                <h2 className="dashboardTitle">250</h2>
                            </Col>
                            <Col xs={1} >
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3}>
                                <img className="dashboardIcon" src="/images/ticket.png"/>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col>
                    <div className="dashboardButton">
                        <Row className="rowHomeSupervisor">
                            <Col xs={8}>
                                Tiempo promedio mensual de atención por ticket &#40;prioridad alta&#41;
                                <h2 className="dashboardTitle">0h 25m</h2>
                            </Col>
                            <Col xs={1}>
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3}>
                                <img className="dashboardIcon" src="/images/clock.png"/>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row className="rowHomeSupervisor">
                <Col>
                    <div className="dashboardButton">
                        <Row className="rowHomeSupervisor">
                            <Col xs={8}>
                                Incidencias levantadas hoy
                                <h2 className="dashboardTitle">67</h2>
                            </Col>
                            <Col xs={1}>
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3}>
                                <img className="dashboardIcon" src="/images/warning.png"/>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col>
                    <div className="dashboardButton">
                        <Row className="rowHomeSupervisor">
                            <Col xs={8}>
                                Tiempo promedio mensual de atención por ticket &#40;prioridad media&#41;
                                <h2 className="dashboardTitle">2h 10m</h2>
                            </Col>
                            <Col xs={1}>
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3}>
                                <img className="dashboardIcon" src="/images/clock.png"/>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row className="rowHomeSupervisor">
                <Col>
                    <div className="dashboardButton">
                        <Row className="rowHomeSupervisor">
                            <Col xs={8}>
                                Tickets mensuales resueltos fuera de tiempo
                                <h2 className="dashboardTitle">4</h2>
                            </Col>
                            <Col xs={1}>
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3}>
                                <img className="dashboardIcon" src="/images/calendar.png"/>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col>
                    <div className="dashboardButton">
                        <Row className="rowHomeSupervisor">
                            <Col xs={8}>
                                Tiempo promedio mensual de atención por ticket &#40;prioridad baja&#41;
                                <h2 className="dashboardTitle">9h 12m</h2>
                            </Col>
                            <Col xs={1}>
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3}>
                                <img className="dashboardIcon" src="/images/clock.png"/>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="dashboardButton">
                        <Row className="rowHomeSupervisor">
                            <Col xs={8}>
                                Generar historial de tickets
                            </Col>
                            <Col xs={1}>
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3}>
                                <img className="dashboardIcon" src="/images/archivo.png"/>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col>
                    <div className="dashboardButton">
                        <Row className="rowHomeSupervisor">
                            <Col xs={8}>
                                Generar reporte
                            </Col>
                            <Col xs={1}>
                                <div className="divSeparator"></div>
                            </Col>
                            <Col xs={3}>
                                <img className="dashboardIcon" src="/images/archivo.png"/>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>

            <Row className="graphicsArea">
                <Col>
                    <Line options={monthly} data={data} />
                </Col>
                <Col>
                    <Line options={weekly} data={data} />
                </Col>
            </Row>

            <Row className="graphicsArea">
                <h2>Tickets</h2>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Categoria</th>
                            <th>Cliente</th>
                            <th>Fecha y hora</th>
                            <th>Prioridad</th>
                            <th>Comentario</th>
                            <th>Tecnico</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>02132</td>
                            <td>Banda del equipo</td>
                            <td>Cliente01</td>
                            <td>01/06/2023 03:34</td>
                            <td>Alta</td>
                            <td>La banda dejo de correr</td>
                            <td>Tecnico01</td>
                            <td><Button className="btnClose">Cerrar</Button></td>
                        </tr>
                        <tr>
                            <td>12393</td>
                            <td>Rodillos</td>
                            <td>Cliente23</td>
                            <td>04/06/2023 01:50</td>
                            <td>Alta</td>
                            <td>Los rodillos se detuvieron</td>
                            <td>Tecnico25</td>
                            <td><Button className="btnClose">Cerrar</Button></td>
                        </tr>
                        <tr>
                            <td>23423</td>
                            <td>Sensores</td>
                            <td>Cliente34</td>
                            <td>05/08/2023 13:14</td>
                            <td>Media</td>
                            <td>Un sensor no detectó la...</td>
                            <td>Tecnico12</td>
                            <td><Button className="btnClose">Cerrar</Button></td>
                        </tr>
                    </tbody>
                </Table>
            </Row>

            <Row className="graphicsArea">
                <h2>Historial</h2>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Categoria</th>
                            <th>Cliente</th>
                            <th>Fecha y hora</th>
                            <th>Prioridad</th>
                            <th>Comentario</th>
                            <th>Tecnico</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>02132</td>
                            <td>Banda del equipo</td>
                            <td>Cliente01</td>
                            <td>01/06/2023 03:34</td>
                            <td>Alta</td>
                            <td>La banda dejo de correr</td>
                            <td>Tecnico01</td>
                            <td>Cerrado</td>
                        </tr>
                        <tr>
                            <td>12393</td>
                            <td>Rodillos</td>
                            <td>Cliente23</td>
                            <td>04/06/2023 01:50</td>
                            <td>Alta</td>
                            <td>Los rodillos se detuvieron</td>
                            <td>Tecnico25</td>
                            <td>Cerrado</td>
                        </tr>
                        <tr>
                            <td>23423</td>
                            <td>Sensores</td>
                            <td>Cliente34</td>
                            <td>05/08/2023 13:14</td>
                            <td>Media</td>
                            <td>Un sensor no detectó la...</td>
                            <td>Tecnico12</td>
                            <td>Cerrado</td>
                        </tr>
                    </tbody>
                </Table>
            </Row>
        </Container>
    )
}


//Graphs
export const monthly = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Grafica mensual',
    },
  },
};
export const weekly = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Grafica semanal',
      },
    },
  };
const labels = [1, 2, 3, 4, 5];

export const data = {
  labels,
  datasets: [
    {
      data: [15, 18, 6, 12, 8],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};
