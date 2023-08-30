import React, { useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table, Navbar, Container, Nav, Row, Col, NavDropdown } from "react-bootstrap";
import Cookies from "universal-cookie";
import './HomeSupervisor.css';
import { API_BASE_URL } from '../constants.js';
import Swal from 'sweetalert2';
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
import axios from "axios";
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
const cookies = new Cookies();

export default function HomeSupervisor() {
    const [info, setInfo] = React.useState({
            "all_tickets": 0,
            "todays_tickets": 0,
            "out_of_time_tickets": 0,
            "avg_time_for_tickets": {
                "high_prior": "",
                "medium_prior": "",
                "low_prior": ""
            },
            "graphic_data": {
                "monthly": [],
                "weekly": []
            },
            "tickets": {
                "first_section": [],
                "second_section": []
            }
    });
    const [username, setUsername] = React.useState("");
    const [useremail, setUseremail] = React.useState("");

    useEffect(() => {
        axios.get(`${API_BASE_URL}/home/getSupervisorHome/${cookies.get("USER_TOKEN")}`)
            .then((res) => {
                setInfo(res.data);
            });
        axios.get(`${API_BASE_URL}/users/user/${cookies.get("USER_TOKEN")}`)
            .then((res) => {
                setUseremail(res.data["EMAIL"]);
                setUsername(res.data["FULLNAME"]);
            });
    });

    const logout = () => {
        cookies.remove("USER_TOKEN", {path: "/"});
        window.location.href = "/";
    }

    const closeTicket = (props) => {
        Swal.fire({
            title: '¿Seguro que deseas cerrar el ticket?',
            showDenyButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: `Cancelar`,
          }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire('El ticket ha sido cerrado', '', 'success');

                await axios.put(
                `${API_BASE_URL}/home/ticket`,
                {
                    userId: cookies.get("USER_TOKEN"),
                    ticketId: props.ticketId,
                    statusId: 9,
                    comment: "Se cierra el ticket",
                    technicalId: props.technicalId
                });
            } else if (result.isDenied) {
              Swal.fire('El ticket no se cerró', '', 'info');
            }
          })
    }

    //Graphs
    let weekDataOpened = Array(7).fill(0);
    let weekDataPaused = Array(7).fill(0);
    let weekDataClosed = Array(7).fill(0);
    let monthDataOpened = Array(12).fill(0);
    let monthDataPaused = Array(12).fill(0);
    let monthDataClosed = Array(12).fill(0);

    for(const elem in info["graphic_data"]["monthly"]) {
        if(info["graphic_data"]["monthly"][elem]["statusId"] == 9) {
            monthDataClosed.splice(info["graphic_data"]["monthly"][elem]["period"]-1, 0, info["graphic_data"]["monthly"][elem]["count"])
        }
        else if(info["graphic_data"]["monthly"][elem]["statusId"] == 6) {
            monthDataPaused.splice(info["graphic_data"]["monthly"][elem]["period"]-1, 0, info["graphic_data"]["monthly"][elem]["count"])
        }
        else if(info["graphic_data"]["monthly"][elem]["statusId"] == 4) {
            monthDataOpened.splice(info["graphic_data"]["monthly"][elem]["period"]-1, 0, info["graphic_data"]["monthly"][elem]["count"])
        }
    }
    for(const elem in info["graphic_data"]["weekly"]) {
        if(info["graphic_data"]["weekly"][elem]["statusId"] == 9) {
            weekDataClosed.splice(info["graphic_data"]["weekly"][elem]["period"]-1, 0, info["graphic_data"]["weekly"][elem]["count"])
        }
        else if(info["graphic_data"]["weekly"][elem]["statusId"] == 6) {
            weekDataPaused.splice(info["graphic_data"]["weekly"][elem]["period"]-1, 0, info["graphic_data"]["weekly"][elem]["count"])
        }
        else if(info["graphic_data"]["weekly"][elem]["statusId"] == 4) {
            weekDataOpened.splice(info["graphic_data"]["weekly"][elem]["period"]-1, 0, info["graphic_data"]["weekly"][elem]["count"])
        }
    }

    const weeklyData = {
        labels: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        datasets: [
            {
                label: 'Tickets abiertos',
                data: weekDataOpened,
                borderColor: 'rgb(255, 0, 0)',
                backgroundColor: 'rgb(255, 0, 0)',
            },
            {
                label: 'Tickets pausados',
                data: weekDataPaused,
                borderColor: 'rgb(0, 255, 0)',
                backgroundColor: 'rgb(0, 255, 0)',
            },
            {
                label: 'Tickets cerrados',
                data: weekDataClosed,
                borderColor: 'rgb(0, 0, 255)',
                backgroundColor: 'rgb(0, 0, 255)',
            },
        ],
    };
    const monthlyData = {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        datasets: [
            {
                label: 'Tickets abiertos',
                data: monthDataOpened,
                borderColor: 'rgb(255, 0, 0)',
                backgroundColor: 'rgb(255, 0, 0)',
            },
            {
                label: 'Tickets pausados',
                data: monthDataPaused,
                borderColor: 'rgb(0, 255, 0)',
                backgroundColor: 'rgb(0, 255, 0)',
            },
            {
                label: 'Tickets cerrados',
                data: monthDataClosed,
                borderColor: 'rgb(0, 0, 255)',
                backgroundColor: 'rgb(0, 0, 255)',
            },
        ],
    }

    const monthly = {
        type: 'line',
        data: monthlyData,
        options: {
            responsive: true,
            plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart'
            }
            }
        },
    };
    const weekly = {
        type: 'line',
        data: weeklyData,
        options: {
            responsive: true,
            plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart'
            }
            }
        },
    };

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
                                <NavDropdown title={username} id="basic-nav-dropdown" style={{textAlign:'right', fontWeight:'bold'}} drop='down-centered'>
                                    <NavDropdown.Item onClick={logout}>Cerrar sesi&oacute;n</NavDropdown.Item>                            
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

            <Row className="rowHomeSupervisor">
                <Col>
                    <div className="dashboardButton">
                        <Row className="rowHomeSupervisor">
                            <Col xs={8}>
                                Tickets totales
                                <h2 className="dashboardTitle">{info["all_tickets"]}</h2>
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
                                <h2 className="dashboardTitle">{info["avg_time_for_tickets"]["high_prior"]["time"]}</h2>
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
                                <h2 className="dashboardTitle">{info["todays_tickets"]}</h2>
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
                                <h2 className="dashboardTitle">{info["avg_time_for_tickets"]["medium_prior"]["time"]}</h2>
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
                                <h2 className="dashboardTitle">{info["out_of_time_tickets"]}</h2>
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
                                <h2 className="dashboardTitle">{info["avg_time_for_tickets"]["low_prior"]["time"]}</h2>
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
                    <Line options={weekly} data={weeklyData} />
                </Col>
                <Col>
                    <Line options={monthly} data={monthlyData} />
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
                        { info["tickets"]["first_section"].map((ticket) => {
                            return(
                                <tr>
                                    <td>{ticket.ticketId}</td>
                                    <td>{ticket.category}</td>
                                    <td>{ticket.client}</td>
                                    <td>{ticket.openDate}</td>
                                    <td>{ticket.priority}</td>
                                    <td>{ticket.situation}</td>
                                    <td>{ticket.technical}</td>
                                    <td>
                                        <Button onClick={() => closeTicket(ticket)} className="btnClose">Cerrar</Button>
                                    </td>
                                </tr>
                            )
                        }) }
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
                        { info["tickets"]["second_section"].map((ticket) => {
                            return(
                                <tr>
                                    <td>{ticket.ticketId}</td>
                                    <td>{ticket.category}</td>
                                    <td>{ticket.client}</td>
                                    <td>{ticket.openDate}</td>
                                    <td>{ticket.priority}</td>
                                    <td>{ticket.situation}</td>
                                    <td>{ticket.technical}</td>
                                    <td>{ticket.status}</td>
                                </tr>
                            )
                        }) }
                    </tbody>
                </Table>
            </Row>
        </Container>
    )
}