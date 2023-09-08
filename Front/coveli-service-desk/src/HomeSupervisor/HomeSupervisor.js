import React, { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table, Navbar, Container, Nav, Row, Col, NavDropdown, Modal, InputGroup, Form, Carousel } from "react-bootstrap";


import Cookies from "universal-cookie";
import './HomeSupervisor.css';
import { API_BASE_URL } from '../constants.js';
import Swal from 'sweetalert2';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableContainer from  '@mui/material/TableContainer';
import { Paper, colors } from '@mui/material';

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
let CancelToken = axios.CancelToken;
let cancelTokenSource = CancelToken.source();

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

export default function HomeSupervisor() {
    const CancelToken = axios.CancelToken
    const cancelTokenSource = CancelToken.source()

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
        axios.get(`${API_BASE_URL}/home/getSupervisorHome/${cookies.get("USER_TOKEN")}`, { cancelToken: cancelTokenSource.token })
        .then((res) => {
            setInfo(res.data);
        })
        .catch((err) => handleError(err));
        axios.get(`${API_BASE_URL}/users/user/${cookies.get("USER_TOKEN")}`, { cancelToken: cancelTokenSource.token })
            .then((res) => {
                setUseremail(res.data["EMAIL"]);
                setUsername(res.data["FULLNAME"]);
            })
        .catch((err) => handleError(err));
    });

    const logout = () => {
        cookies.remove("USER_TOKEN", {path: "/"});
        window.location.href = "/";
    }

    const updateTicket = (action, ticket) => {
        let actionString = (action == 9) ? ["cerrar", "cerrado", "cierra"] : ["rechazar", "rechazado", "rechaza"];

        Swal.fire({
            title: `¿Deseas ${actionString[0]} el ticket ${ticket.ticketId}?`,
            showDenyButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: `Cancelar`,
          }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire('El ticket ha sido ' + actionString[1], '', 'success');

                await axios.put(
                `${API_BASE_URL}/home/ticket`,
                {
                    userId: cookies.get("USER_TOKEN"),
                    ticketId: ticket.ticketId,
                    statusId: action,
                    comment: `Se ${actionString[2]} el ticket`,
                    technicalId: ticket.technicalId
                });
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
                        <Nav.Link href="/home" onClick={() => {cancelTokenSource.cancel('Operation canceled')}}>Home</Nav.Link>
                    </Nav>
                    <div>
                        <Row>
                            <Col>
                            <img src='/images/user.png' style={{width:'2.5rem', height:'2.5rem'}}></img>
                            </Col>
                            <Col>
                                <NavDropdown title={username} id="basic-nav-dropdown" style={{textAlign:'right', fontWeight:'bold'}} drop='down-centered'>
                                    <NavDropdown.Item onClick={() => { cancelTokenSource.cancel('Operation canceled'); logout();}}>Cerrar sesi&oacute;n</NavDropdown.Item>                            
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { info["tickets"]["first_section"].map((row) => (
                            <RowTicket key={row.ticketId} row={row} />
                        ))}                        
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
                        { info["tickets"]["second_section"].map((row) => (
                            <RowTicketHistory key={row.ticketId} row={row} />
                        ))}                                                
                    </tbody>
                </Table>
            </Row>
        </Container>
    )
}


function RowTicket(props){    

    const [ticketResultTechnical, setticketResultTechnical] = React.useState([]);

    const [show, setShow] = React.useState(false);
    const [newStatus, setNewStatus] = React.useState(0);
    const [currentTicket, setCurrentTicket] = React.useState({});
    const handleClose = () => setShow(0);
    const handleShow = () => setShow(true);
    const [comment, setComment] = useState("");
    const onChange = (event) => {
        setComment(event.target.value);
    }

    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [ticketHist, setTicketHist] =  React.useState({
        "ticketsHistory": []
    });

    const [ticketHistEvi, setTicketHistEvi] =  React.useState({
        "evidences": []
    });

    const [mdlEvidences, setShowEvidences] = useState(false);    
    const showEvidences = () => setShowEvidences(true);     
    const closeEvidences = () => setShowEvidences(false);   



    const updateTicket = () =>  {
        
        var message = "";              
        var fileInputSupervisor = document.getElementById("fileEvindece");

        if ('files' in fileInputSupervisor) {
            if(comment == ""){
                message = "¡Ingresar comentarios!";
            }
            else if (fileInputSupervisor.files.length == 0) {
                message = "¡Ingresar al menos una imagen de evidencia!";
            
            }
            else if(fileInputSupervisor.files.length > 2){
                message = "¡Ingresar máximo dos imágenes de evidencia!";
            }            
            else{
                  
                axios.put(`${API_BASE_URL}/home/ticket`,{
                    userId: parseInt(cookies.get("USER_TOKEN")),
                    ticketId:currentTicket.ticketId,
                    statusId:newStatus,
                    comment:comment,            
                    technicalId: currentTicket.technicalId
                })
                .then((res) => {                         
                    if(res.data["@p_result"] == 1){
                        for (var i = 0; i < fileInputSupervisor.files.length; i++) {                    
                            var file = fileInputSupervisor.files[i];                                                     
                            const reader = new FileReader();                    
                            reader.onloadend = () => {                                                       
                                const base64String = reader.result;                                                                                                                                   
                                axios.post(`${API_BASE_URL}/homeT/add_evidences`,{
                                    p_ticketHistoryId:res.data["@p_ticketHistoryID"],
                                    p_evidencia:base64String                                   
                                    });
                            };
                            reader.readAsDataURL(file);                                
                        }
                        setComment("");
                        handleClose();
                        Swal.fire({
                            icon: 'success',
                            title: "" + res.data["@p_message"] + ""
                        })          
                    }
                    else{            
                        Swal.fire({
                            icon: 'error',
                            title: ""+ res.data["@p_message"] + ""
                        })
                    }                    
                });
            }        
        }
        else{
            if (fileInputSupervisor.value == "") {
                message += "Please browse for one or more files.";
                message += "<br />Use the Control or Shift key for multiple selection.";
            }
            else {
                message += "Your browser doesn't support the files property!";
                message += "<br />The path of the selected file: " + fileInputSupervisor.value;
            }
        }
        var info = document.getElementById ("info");
        info.innerHTML = message;
    }

    const getTicketHistory = (ticketId) => {
        axios.get(`${API_BASE_URL}/homeC/getTicketHistoryHome/${ticketId}`, {cancelToken: cancelTokenSource.token})        
        .then((res) => {                                           
            setTicketHist(res.data);              
        })
        .catch((err) => handleError(err));
    }     

    const getTicketHistoryEvidences = (ticketHistoryId) => {
        axios.get(`${API_BASE_URL}/home/getTicketEvidences/${ticketHistoryId}`, {cancelToken: cancelTokenSource.token})        
        .then((res) => {                      
            setTicketHistEvi(res.data);            
        })
        .catch((err) => handleError(err));
    }    
    
        
    return(        
        <React.Fragment>
            
                <Modal show={show} onHide={handleClose} style={{color:"#66CCC5"}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ticket: {currentTicket.ticketId}</Modal.Title>
                    </Modal.Header>                    
                    <Modal.Body>                                
                        <InputGroup className='mb-2'>
                            { newStatus == 9 ? "¿Deseas cerrar el ticket?" : "¿Deseas rechazar el ticket?"}                            
                        </InputGroup>                                   
                        <InputGroup className='mb-2'>
                            <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Comentarios</InputGroup.Text>
                            <Form.Control id="txtComment" as="textarea" aria-label="With textarea" style={{height:'5rem'}} required value={comment} onChange={(e) => onChange(e)}/>
                        </InputGroup>
                        <InputGroup className='mb-2'>
                            <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Evidencias 
                            </InputGroup.Text>
                            <Form.Control id="fileEvindece" type="file" accept=".png,.jpg,.jpeg" multiple/><br></br>                        
                        </InputGroup>                        
                        <div id="info" style={{marginTop:'30px', color:'red'}}></div>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={()=>{setComment(""); handleClose();}}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={ (event) => {                            
                            updateTicket();
                            }}
                            style={{margin:'1rem'}}>
                            Aceptar
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={mdlEvidences} onHide={closeEvidences} style={{color:"#66CCC5"}}>
                <Modal.Header closeButton>
                    <Modal.Title>Evidencias del Ticket({row.ticketId})</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel>
                    { ticketHistEvi["evidences"].map((ev) => {   
                        return(
                            <Carousel.Item>
                                <img className='d-block w-100' src={ev.evidencia} ></img>                            
                            </Carousel.Item>                        
                        )                                                                         
                    }) }
                        
                    </Carousel>                    
                </Modal.Body>                
            </Modal>                        
                     
            <tr  sx={{ '& > *': { borderBottom: 'unset' } }}>
                <td component="th" scope='row'>                                   
                    <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() =>{setOpen(!open); getTicketHistory(row.ticketId);}}                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}                            
                    </IconButton>                             
                    {row.ticketId}
                </td>                
                <td>{row.category}</td>
                <td>{row.client}</td>
                <td>{row.openDate}</td>
                <td>{row.priority}</td>
                <td>{row.situation}</td>
                <td>{row.technical}</td>
                <td>{row.status}</td>

                <td>
                    <Button onClick={() => {setNewStatus(9); handleShow(); setCurrentTicket(row); }} className="btnClose">Cerrar</Button>
                    <Button onClick={() => {setNewStatus(8); handleShow(); setCurrentTicket(row); }} variant="danger">Rechazar</Button>
                </td>                
            </tr>                                    
            <tr>
                <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Historial del Ticket
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <thead>
                                    <tr>
                                        <th>Estatus</th>
                                        <th>Fecha modificación</th>                                        
                                        <th>Comentarios</th>
                                        <th>Técnico</th>
                                        <th>Usuario</th>
                                        <th>Evidencias</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { ticketHist["ticketsHistory"].map((the) => {   
                                        return(<>
                                        <tr  key={the.comment} component="th" scope='row'>                                                       
                                            <td >{the.status}</td>
                                            <td>{the.currentDate}</td>
                                            <td>{the.comment}</td>
                                            <td>{the.technicalFullName}</td>
                                            <td>{the.userFullName}</td>
                                            <td >{the.evidences > 0 ?<Button style={{margin:0}} onClick={()=>{showEvidences(); getTicketHistoryEvidences(the.ticketsHistoryId);}}>Ver</Button>:""}</td>                                                                
                                        </tr>
                                        </>)                                                                         
                                    }) }
                                </tbody>
                            </Table>                                                    
                        </Box>                                                
                    </Collapse>
                </td>
            </tr>                                                                                                                     
        </React.Fragment>
    );
}



function RowTicketHistory(props){        

    const { row } = props;    
    const [open, setOpen] = React.useState(false);
    
    const [ticketHist, setTicketHist] =  React.useState({
        "ticketsHistory": []
    });    
    const [ticketHistEvi, setTicketHistEvi] =  React.useState({
        "evidences": []
    });

    const [mdlEvidences, setShowEvidences] = useState(false);    
    const showEvidences = () => setShowEvidences(true);     
    const closeEvidences = () => setShowEvidences(false);   

    const getTicketHistory = (ticketId) => {
        axios.get(`${API_BASE_URL}/homeC/getTicketHistoryHome/${ticketId}`, {cancelToken: cancelTokenSource.token})        
        .then((res) => {                                           
            setTicketHist(res.data);              
        })
        .catch((err) => handleError(err));
    }
    const getTicketHistoryEvidences = (ticketHistoryId) => {
        axios.get(`${API_BASE_URL}/home/getTicketEvidences/${ticketHistoryId}`, {cancelToken: cancelTokenSource.token})        
        .then((res) => {                      
            setTicketHistEvi(res.data);            
        })
        .catch((err) => handleError(err));
    }    
        
    return(        
        <React.Fragment>            
            <Modal show={mdlEvidences} onHide={closeEvidences} style={{color:"#66CCC5"}}>
                <Modal.Header closeButton>
                    <Modal.Title>Evidencias del Ticket({row.ticketId})</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel>
                    { ticketHistEvi["evidences"].map((ev) => {   
                        return(
                            <Carousel.Item>
                                <img className='d-block w-100' src={ev.evidencia} ></img>                            
                            </Carousel.Item>                        
                        )                                                                         
                    }) }
                        
                    </Carousel>                    
                </Modal.Body>                
            </Modal>                        
            <tr  sx={{ '& > *': { borderBottom: 'unset' } }}>
                <td component="th" scope='row'>                                   
                    <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() =>{setOpen(!open); getTicketHistory(row.ticketId);}}                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}                            
                    </IconButton>                             
                    {row.ticketId}
                </td>                
                <td>{row.category}</td>
                <td>{row.client}</td>
                <td>{row.openDate}</td>
                <td>{row.priority}</td>
                <td>{row.situation}</td>
                <td>{row.technical}</td>
                <td>{row.status}</td>
            </tr>                                    
            <tr>
                <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Historial del Ticket
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <thead>
                                    <tr>
                                        <th>Estatus</th>
                                        <th>Fecha modificación</th>                                        
                                        <th>Comentarios</th>
                                        <th>Técnico</th>
                                        <th>Usuario</th>
                                        <th>Evidecias</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { ticketHist["ticketsHistory"].map((the) => {   
                                        return(<>
                                        <tr  key={the.comment} component="th" scope='row'>                                                       
                                            <td >{the.status}</td>
                                            <td>{the.currentDate}</td>
                                            <td>{the.comment}</td>
                                            <td>{the.technicalFullName}</td>
                                            <td>{the.userFullName}</td>
                                            <td >{the.evidences > 0 ?<Button style={{margin:0}} onClick={()=>{showEvidences(); getTicketHistoryEvidences(the.ticketsHistoryId);}}>Ver</Button>:""}</td>                                                                
                                        </tr>
                                        </>)                                                                         
                                    }) }
                                </tbody>
                            </Table>                                                    
                        </Box>                                                
                    </Collapse>
                </td>
            </tr>                                                                                                                     
        </React.Fragment>
    );
}