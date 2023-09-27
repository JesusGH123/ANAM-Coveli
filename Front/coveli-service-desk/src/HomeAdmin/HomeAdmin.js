import { useState, useEffect } from 'react';
import axios from "axios";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, Row, Table, Button, Modal, Carousel} from "react-bootstrap";
import Cookies from "universal-cookie";
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../constants.js';

import './HomeAdmin.css'
import NavigationBar from '../Navbar/Navbar';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableContainer from  '@mui/material/TableContainer';
import { Paper} from '@mui/material';

const cookies = new Cookies();
let CancelToken = axios.CancelToken;
let cancelTokenSource = CancelToken.source();

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

export default function HomeAdmin(){
    const CancelToken = axios.CancelToken
    const cancelTokenSource = CancelToken.source()

    const [isAccesible, setIsAccesible] = React.useState(false);

    const [info, setInfo] = React.useState({
        "tickets_without_attendance": 0,
        "paused_tickets": 0,
        "closed_tickets": 0,
        "on_revision_tickets": 0,
        "all_tickets": []
    });

    useEffect(() => {
        axios.post(`${API_BASE_URL}/users/checkPermissions`, {
            userId: cookies.get("USER_TOKEN"),
            nextPath: '/homeA'
        }).then((res) => {
            if(res.data)
                setIsAccesible(true)
            else
                window.location.href = "/";
        })
    }, [])
    
    useEffect(() => {
        if(cookies.get("USER_TOKEN")) {
            axios.get(`${API_BASE_URL}/home/getAdminHome/${cookies.get("USER_TOKEN")}`, { cancelToken: cancelTokenSource.token })
            .then((res) => {
                setInfo(res.data);
            })
            .catch((err) => handleError(err));
        }
    });

    const [currentTicket, setCurrentTicket] = useState({});
    const [comment, setComment] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
            { (isAccesible) ? 
                <>
                <div>
                <NavigationBar/>
                </div>
                <Row className="rowAdmin">
                    <Col>
                        <div className="dashboardButton">
                            <Row>
                                <Col xs={7} style={{fontSize:'1.2rem'}} >
                                    Todos los tickets
                                    <h2 style={{ fontSize:'4rem'}}>{info["all_tickets_count"]}</h2>
                                </Col>
                                <Col xs={1} >
                                    <div className="divSeparator"></div>
                                </Col>
                                <Col xs={2} style={{marginTop:"1rem"}} >                                
                                    <img className="imgInformation" src="/images/ticket.png"></img>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col>
                        <div className="dashboardButton">
                            <Row>
                                <Col xs={7} style={{fontSize:'1.2rem'}} >
                                    Tickets sin asignar
                                    <h2 style={{ fontSize:'4rem'}}>{info["not_assigned_tickets_count"]}</h2>
                                </Col>
                                <Col xs={1}>
                                    <div className="divSeparator"></div>
                                </Col>
                                <Col xs={2} style={{marginTop:"1rem"}} >                                
                                    <img className="imgInformation" src="/images/detener.png"></img>
                                </Col>
                            </Row>                                        
                        </div>
                    </Col>
                    <Col>
                        <div className="dashboardButton">
                            <Row>
                                <Col xs={7} style={{fontSize:'1.2rem'}} >
                                    Tickets cerrados
                                    <h2 style={{ fontSize:'4rem'}}>{info["closed_tickets_count"]}</h2>
                                </Col>
                                <Col xs={1}>
                                    <div className="divSeparator"></div>
                                </Col>
                                <Col xs={2} style={{marginTop:"1rem"}} >                                
                                    <img className="imgInformation" src="/images/marca-de-verificacion.png"></img>
                                </Col>
                            </Row>                        
                        </div>
                    </Col>
                </Row>
                <Row className="rowTecnical">                    
                    <Col>
                        <div className="dashboardButton">
                            <Row>
                                <Col xs={7} style={{fontSize:'1.2rem'}} >
                                    Tickets asignados
                                    <h2 style={{ fontSize:'4rem'}}>{info["assigned_tickets_count"]}</h2>
                                </Col>
                                <Col xs={1}>
                                    <div className="divSeparator"></div>
                                </Col>                            
                                <Col xs={2} style={{marginTop:"1rem"}} >                                
                                    <img className="imgInformation" src="/images/informacion.png"></img>
                                </Col>
                            </Row>         
                        </div>                                                   
                    </Col>
                    <Col>
                        <div className="dashboardButton">
                            <Row>
                                <Col xs={7} style={{fontSize:'1.2rem'}} >
                                    Tickets pausados
                                    <h2 style={{ fontSize:'4rem'}}>{info["paused_tickets_count"]}</h2>
                                </Col>
                                <Col xs={1}>
                                    <div className="divSeparator"></div>
                                </Col>
                                <Col xs={2} style={{marginTop:"1rem"}} >                                
                                    <img className="imgInformation" src="/images/boton-de-pausa-de-video.png"></img>
                                </Col>
                            </Row>                        
                        </div>
                    </Col>                
                </Row>   
                <Row className='graphicsArea'>
                    <Col>
                    <TableContainer component={Paper}>
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h4" gutterBottom component="div">
                            Tickets
                        </Typography>
                        <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Ubicación</th>
                                <th>Equipo</th>
                                <th>Serie</th>
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
                            info["all_tickets"].map((row) => (<RowTicket key={row.ticketId} row={row} />))
                            }                     
                        </tbody>
                    </Table>                    
                    </Box>                
                    </TableContainer>                
                    </Col>
                </Row>            
                </>
                :
                null
            }            
        </div>        
    )
}

function RowTicket(props){    
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [mdlEvidences, setShowEvidences] = useState(false);    
    const showEvidences = () => setShowEvidences(true);     
    const closeEvidences = () => setShowEvidences(false);   

    const [ticketHist, setTicketHist] =  React.useState({
        "ticketsHistory": []
    });

    const [ticketHistEvi, setTicketHistEvi] =  React.useState({
        "evidences": []
    });

    

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
                    <Modal.Title>Evidencias del Ticket ({row.ticketId})</Modal.Title>
                </Modal.Header>
                <Modal.Body>    
                    <Carousel>         
                    { ticketHistEvi["evidences"].map((ev) => {   
                        return(
                            <Carousel.Item>
                                <img src={ev.evidencia} style={{width:'500px', height:'300px'}}></img>
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
                        onClick={() =>{getTicketHistory(row.ticketId);setOpen(!open);}}                        >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}                            
                    </IconButton>                             
                    {row.ticketId}
                </td>
                <td>{row.equipmentLocation}</td>
                <td>{row.equipmentModel}</td>
                <td>{row.equipmentSerial}</td>
                <td>{row.situation}</td>
                <td>{row.client}</td>
                <td>{row.openDate}</td>
                <td>{row.priority}</td>
                <td>{row.technical}</td>
                <td style={{textAlign:"center"}}>{row.status}</td>                                        
            </tr>
            <tr>
                <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
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