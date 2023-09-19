import React, { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table, Container, Row, Col, Modal, InputGroup, Form, Carousel } from "react-bootstrap";
import { Page, Text, View, Document, StyleSheet,PDFDownloadLink, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';



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

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import ReportSumary from'../Reports/ReportMaintenanceSummary.js';



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
import NavigationBar from "../Navbar/Navbar";

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
let clicked = false;
function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

export default function HomeSupervisor() {
    
    const CancelToken = axios.CancelToken;
    const cancelTokenSource = CancelToken.source();

    const [startDate, setStartDate] = useState(new Date())
    const [finishDate, setFinishDate] = useState(new Date())
    const [startDateFormat, setStartDateFormat] = useState(new Date())
    const [finishDateFormat, setFinishDateFormat] = useState(new Date())

    const [showReport, setShowReport] = React.useState(false);
    const handleCloseReport = () => setShowReport(false);
    const handleShowReport = () => setShowReport(true);
    

    const [isAccesible, setIsAccesible] = React.useState(false);
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

    

    useEffect(() => {
        axios.post(`${API_BASE_URL}/users/checkPermissions`, {
            userId: cookies.get("USER_TOKEN"),
            nextPath: '/homeS'
        }).then((res) => {
            if(res.data)
                setIsAccesible(true)
            else
                window.location.href = "/";
        })
    }, [])

    useEffect(() => {
        axios.get(`${API_BASE_URL}/home/getSupervisorHome/${cookies.get("USER_TOKEN")}`, { cancelToken: cancelTokenSource.token })
        .then((res) => {
            setInfo(res.data);
        })
        .catch((err) => handleError(err));
    });

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

    const generatePdfDocument = () => {        
        axios.post(`${API_BASE_URL}/home/getreportMaintenaceSumary/`,
            {
                status: "9",
                startDate: startDate,
                finishDate: finishDate
            })
            .then(async (res) => {
                const blob = await pdf((
                    <ReportSumary data={res.data} period={"Del " +  startDateFormat + " al " + finishDateFormat} />
                )).toBlob();
                saveAs(blob, "reporte_mantenimiento.pdf");
            });
    };    

    return (
        <Container className="containerLogin">
            {
                (isAccesible) ?
                <>
                <NavigationBar/>
                <Row className="rowHomeSupervisor">
                    <Col>
                        <div className="dashboardButton">
                            <Row className="rowHomeSupervisor">
                                <Col xs={7}>
                                    Tickets totales
                                    <h2 className="dashboardTitle">{info["all_tickets"]}</h2>
                                </Col>
                                <Col xs={1} >
                                    <div className="divSeparator"></div>
                                </Col>
                                <Col xs={2}>
                                    <img className="dashboardIcon" src="/images/ticket.png"/>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col>
                        <div className="dashboardButton">
                            <Row className="rowHomeSupervisor">
                                <Col xs={7}>
                                    Tiempo promedio mensual de atención por ticket &#40;prioridad alta&#41;
                                    <h2 className="dashboardTitle">{info["avg_time_for_tickets"]["high_prior"]["time"]}</h2>
                                </Col>
                                <Col xs={1}>
                                    <div className="divSeparator"></div>
                                </Col>
                                <Col xs={2}>
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
                                <Col xs={7}>
                                    Incidencias levantadas hoy
                                    <h2 className="dashboardTitle">{info["todays_tickets"]}</h2>
                                </Col>
                                <Col xs={1}>
                                    <div className="divSeparator"></div>
                                </Col>
                                <Col xs={2}>
                                    <img className="dashboardIcon" src="/images/warning.png"/>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col>
                        <div className="dashboardButton">
                            <Row className="rowHomeSupervisor">
                                <Col xs={7}>
                                    Tiempo promedio mensual de atención por ticket &#40;prioridad media&#41;
                                    <h2 className="dashboardTitle">{info["avg_time_for_tickets"]["medium_prior"]["time"]}</h2>
                                </Col>
                                <Col xs={1}>
                                    <div className="divSeparator"></div>
                                </Col>
                                <Col xs={2}>
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
                                <Col xs={7}>
                                    Tickets mensuales resueltos fuera de tiempo
                                    <h2 className="dashboardTitle">{info["out_of_time_tickets"]}</h2>
                                </Col>
                                <Col xs={1}>
                                    <div className="divSeparator"></div>
                                </Col>
                                <Col xs={2}>
                                    <img className="dashboardIcon" src="/images/calendar.png"/>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col>
                        <div className="dashboardButton">
                            <Row className="rowHomeSupervisor">
                                <Col xs={7}>
                                    Tiempo promedio mensual de atención por ticket &#40;prioridad baja&#41;
                                    <h2 className="dashboardTitle">{info["avg_time_for_tickets"]["low_prior"]["time"]}</h2>
                                </Col>
                                <Col xs={1}>
                                    <div className="divSeparator"></div>
                                </Col>
                                <Col xs={2}>
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
                                <Col xs={7}>
                                    Generar historial de tickets
                                </Col>
                                <Col xs={1}>
                                    <div className="divSeparator"></div>
                                </Col>
                                <Col xs={2}>
                                    <img className="dashboardIcon" src="/images/archivo.png"/>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col>
                        <div className="dashboardButton dashboardButtonClick" onClick={handleShowReport}>
                            <Row className="rowHomeSupervisor">
                                <Col xs={7}>
                                    Generar reporte                                    
                                </Col>
                                <Col xs={1}>
                                    <div className="divSeparator"></div>
                                </Col>
                                <Col xs={2}>
                                    <img className="dashboardIcon" src="/images/archivo.png" />
                                </Col>
                            </Row>
                        </div>
                        <Modal show={showReport} onHide={handleCloseReport} style={{color:"#66CCC5"}}>
                            <Modal.Header closeButton>                                        
                                RESUMEN DE MANTENIMIENTO CORRECTIVO
                            </Modal.Header>
                            <Modal.Body style={{alignItems:'center', textAlign:'center'}}>
                                <div style={{marginBottom:10}}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker label={"Fecha Inicio"} id="dpFechaIni" selected={startDate} onChange={(date) => { setStartDate(date.$y + "-" + (date.$M + 1) + "-"+ date.$D); setStartDateFormat( date.$D + "-" + (date.$M + 1) + "-"+ date.$y);}} />
                                    </LocalizationProvider>
                                </div>                                            
                                <div>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker label={"Fecha Fin"} id="dpFechaFin" selected={finishDate} onChange={(date) => {setFinishDate(date.$y + "-" + (date.$M + 1) + "-"+ date.$D); setFinishDateFormat( date.$D + "-" + (date.$M + 1) + "-"+ date.$y);}} />
                                    </LocalizationProvider>
                                </div>
                                <div>                                                                                
                                    <Button variant="primary" onClick={generatePdfDocument} >Generar</Button>
                                </div>
                            </Modal.Body>                                                 
                        </Modal>   
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
                </>
                    :
                null
            }
        </Container>
    )
}



function RowTicket(props){    

    const [ticketResultTechnical, setticketResultTechnical] = React.useState([]);

    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(0);
    const handleShow = () => setShow(true);


    const [newStatus, setNewStatus] = React.useState(0);
    const [currentTicket, setCurrentTicket] = React.useState({});
    
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
        
            if(comment == ""){
                message = "¡Ingresar comentarios!";
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
                    console.log(res.data);
                    if(res.data["@p_result"] == 1){                                                
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
                    setComment("");
                    handleClose();
                });
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
                    <Button onClick={() => {setNewStatus(8); handleShow(); setCurrentTicket(row); }} variant="danger">Rechazar</Button>
                    <Button onClick={() => {setNewStatus(9); handleShow(); setCurrentTicket(row); }} className="btnClose">Cerrar</Button>
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





