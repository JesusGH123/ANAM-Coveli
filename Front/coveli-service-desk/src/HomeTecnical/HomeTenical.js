import { useState, useEffect } from 'react';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/js/src/collapse.js';
import { Col, Row, Container, Nav, Navbar, Table, Button, Modal, NavDropdown, Form, InputGroup, Carousel} from "react-bootstrap";
import Cookies from "universal-cookie";
import axios from "axios";
import { API_BASE_URL } from '../constants.js';
import Swal from 'sweetalert2';



import './HomeTecnical.css'
import Report from'../Reports/ReportMaintenance.js'

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableContainer from  '@mui/material/TableContainer';
import { Paper } from '@mui/material';

import { PDFDownloadLink,PDFViewer, pdf} from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';

import { saveAs } from "file-saver";


const cookies = new Cookies();
let CancelToken = axios.CancelToken;
let cancelTokenSource = CancelToken.source();

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

export default function HomeTecnical(){  

    const [ticketResultTechnical, setticketResultTechnical] = React.useState([]);

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
        axios.get(`${API_BASE_URL}/homeT/getTechnicalHome/${cookies.get("USER_TOKEN")}`, { cancelToken: cancelTokenSource.token })
            .then((res) => {
                setInfo(res.data);
            }).catch((err) => handleError(err));
        axios.get(`${API_BASE_URL}/users/user/${cookies.get("USER_TOKEN")}`, {cancelToken: cancelTokenSource.token, mode: 'cors'})
            .then((res) => {
                setUseremail(res.data["EMAIL"]);
                setUsername(res.data["FULLNAME"]);
            }).catch((err) => handleError(err));
    });

    

    

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
            
            <Row className="graphicsArea">                                    
                <TableContainer component={Paper}>
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h4" gutterBottom component="div">
                            Tickets
                        </Typography>
                        <Table  striped hover responsive aria-label='customized table'>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Situación</th>
                                    <th>Cliente</th>
                                    <th>Fecha creación</th>
                                    <th>Fecha modificación</th>
                                    <th>Prioridad</th>
                                    <th>Estatus</th>
                                </tr>
                            </thead>
                            <tbody>
                                { info["my_tickets"].map((row) => (
                                    <RowTicket key={row.ticketId} row={row} />
                                ))} 
                            </tbody>
                        </Table>
                    </Box>
                </TableContainer>
            </Row>
            
        </div>        
    )
}


function RowTicket(props){    


    
    
    const [mdlReporte, setShowReporte] = React.useState(false);
    const handleCloseReporte = () => setShowReporte(0);
    const handleShowReporte = () => setShowReporte(true);
    const [show, setShow] = React.useState(false);
    const [modalType, setModalType] = React.useState(0);
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

    const updateTicket = (newStatus, comment) =>  {

        var message = "";
        var fileInputTechnical = document.getElementById("fileEvindece");
        if ('files' in fileInputTechnical) {            
            if(comment == "")
            {               
                if(modalType==1)
                    message = "¡Ingrese algún comentario!";
                else
                    message = "¡Ingrese algún motivo!";
            }
            else if (fileInputTechnical.files.length == 0) {
                message = "¡Ingresar al menos una evidencia!";
            }
            else if(fileInputTechnical.files.length > 2){
                message = "¡Ingresar máximo dos imágenes de evidencia!";
            }                        
            else{            
                axios.put(`${API_BASE_URL}/homeT/update_ticket`,{
                    p_userId:cookies.get("USER_TOKEN"),
                    p_ticketId:currentTicket.ticketId,
                    p_statusId:newStatus,
                    p_comment:comment,            
                    p_technicalId: currentTicket.technicalId
                }).then((res) => {            
                    if(res.data["@p_result"] == 1){                        
                        if(modalType == 1) {                        
                            for (var i = 0; i < fileInputTechnical.files.length; i++) {                    
                                var file = fileInputTechnical.files[i];                                
                                const canvas = document.createElement("canvas");
                                const ctx = canvas.getContext("2d");
                                let currentImg = "";
                                let webpImg = "";
                                let convertedImg = "";
                                currentImg = URL.createObjectURL(file);  
                                webpImg = new Image();                            
                                webpImg.onload = ()=>{
                                canvas.width = webpImg.naturalWidth;
                                canvas.height = webpImg.naturalHeight;
                                ctx.drawImage(webpImg, 0, 0, canvas.width, canvas.height);
                                convertedImg = canvas.toDataURL("image/jpeg", 1.0);                                
                                axios.post(`${API_BASE_URL}/homeT/add_evidences`,{
                                    p_ticketHistoryId:res.data["@p_ticketHistoryID"],                                   
                                    p_evidencia: convertedImg
                                    });
                                }                            
                                webpImg.src = currentImg;                                                     
                                
                            }
                            Swal.fire({
                                icon: 'success',
                                title: ""+ res.data["@p_message"] + ""
                            })
                            handleClose();
                            setComment("");
                        }
                        else{
                            if(modalType == 2){
                                Swal.fire({
                                icon: 'success',
                                title: '¡Se ha pausado el ticket!'
                              })
                            }
                            else{
                                Swal.fire({
                                    icon: 'success',
                                    title: '¡se ha retomado el ticket!'
                                })
                            }
                            handleClose();
                            setComment("");
                        }
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
            if (fileInputTechnical.value == "") {
                message += "Please browse for one or more files.";
                message += "<br />Use the Control or Shift key for multiple selection.";
            }
            else {
                message += "Your browser doesn't support the files property!";
                message += "<br />The path of the selected file: " + fileInputTechnical.value;
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
                {
                    (modalType == 1) ?
                    <Row className='rowTecnical'>
                        <Modal.Body>                                
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Comentarios</InputGroup.Text>
                                <Form.Control id="txtComment" as="textarea" aria-label="With textarea" style={{height:'5rem'}} required value={comment} onChange={(e) => onChange(e)}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Evidencias 
                                </InputGroup.Text>
                                <Form.Control id="fileEvindece" type="file" accept=".png,.jpg,.jpeg" multiple/><br></br>                        
                            </InputGroup>
                            <div id="info" style={{marginTop:"30px", color:'red'}}></div>                                                                                   
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={handleClose}>
                                    Cancelar
                            </Button>
                            <Button variant="primary" onClick={ (event) => {                                    
                                updateTicket(7, comment);
                                }}
                                style={{margin:'1rem'}}>
                                Aceptar
                            </Button>
                        </Modal.Footer>  
                    </Row>                      
                        :
                    (modalType == 2) ?                            
                    <Row>
                        <Modal.Body >
                        <InputGroup className='mb-2'>
                            ¿Estas seguro de que deseas pausar el ticket?
                        </InputGroup>                                   

                        <InputGroup className='mb-2'>
                            <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Motivo</InputGroup.Text>
                            <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => onChange(e)}/>                                    
                        </InputGroup>
                        <div id="info" style={{marginTop:"30px", color:'red'}}></div>                                                                                      
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={() => {                                        
                                updateTicket(6, comment);
                            }}>
                                Aceptar
                            </Button>
                        </Modal.Footer> 
                    </Row>                                                         
                        :
                    <Row>
                        <Modal.Body>                                        
                            <InputGroup className='mb-2'>
                                ¿Deseas retomar el ticket?
                            </InputGroup>                                   
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Motivo</InputGroup.Text>
                                <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => onChange(e)}/>
                            </InputGroup>    
                            <div id="info" style={{marginTop:"30px", color:'red'}}></div>                                                   
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={() => {                                        
                                updateTicket(5, comment);
                            }}>
                                Aceptar
                            </Button>
                        </Modal.Footer>                               
                    </Row>
                }
            </Modal>   


            

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
                            onClick={() =>{setOpen(!open); getTicketHistory(row.ticketId);}}                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}                            
                    </IconButton>                             
                    {row.ticketId}
                </td>                
                <td>{row.situation}</td>
                <td>{row.cliente}</td>
                <td>{row.openDate}</td>
                <td>{row.modificationDate}</td>
                <td>{row.priority}</td>
                { 
                    (row.statusid == 9 ) ?                    
                        <td>
                            <PDFDownloadLink document={<Report ticketId={row.ticketId}/>}>                                        
                                <Button variant='success'style={{borderRadius:'3rem'}}
                                >Generar Reporte</Button>
                            </PDFDownloadLink>
                        </td>
                    :
                        (row.statusid == 7) ?
                            <td>{row.status}</td>
                            :
                            (row.statusid == 6) ? 
                            <td>
                                <Button onClick={() => {
                                    setOpen(!open);
                                    setModalType(3);
                                    handleShow();
                                    setCurrentTicket(row);
                                }} variant='warning' style={{borderRadius:20}}>Retomar</Button>
                            </td>
                            :
                            <td>
                                <Button onClick={() => {
                                    setOpen(!open);
                                    setModalType(2);
                                    handleShow();
                                    setCurrentTicket(row);
                                }} variant='warning' style={{borderRadius:20}}>Pausar</Button>
                                <Button onClick={() => {
                                    setOpen(!open);
                                    setModalType(1);
                                    handleShow();
                                    setCurrentTicket(row);
                                }} variant='secondary' style={{borderRadius:20}}>Solicitar cierre</Button>
                            </td>
                }
            </tr>                                    
            <tr>
                <td  style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
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