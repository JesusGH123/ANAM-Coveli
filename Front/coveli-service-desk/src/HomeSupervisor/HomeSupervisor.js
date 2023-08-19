import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Image, Navbar, Container, Nav, Row, Col, NavDropdown } from "react-bootstrap";
import Cookies from "universal-cookie";
import './HomeSupervisor.css';

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
                    <Image className="smallIcon" src="/images/user.png"/>
                    <NavDropdown align="end" title="Jesus Garcia" id="basic-nav-dropdown">
                        <NavDropdown.Item onClick={() => logout()}>Cerrar sesi&oacute;n</NavDropdown.Item>
                    </NavDropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Row className="rowHomeSupervisor">
                <Col>
                    <div className="dashboardButton">
                        <Row className="rowHomeSupervisor">
                            <Col xs={8}>
                                Tickets totales
                                <h2>250</h2>
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
                                <h2>0h 25m</h2>
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
                                <h2>67</h2>
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
                                <h2>2h 10m</h2>
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
                                <h2>4</h2>
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
                                <h2>9h 12m</h2>
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
        </Container>
    )
}