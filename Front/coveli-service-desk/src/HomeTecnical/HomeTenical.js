import { useState, useEffect } from 'react';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/js/src/collapse.js';
import { Col, Row, Container, Nav, Navbar, Table, Button, Modal, NavDropdown, Form, InputGroup} from "react-bootstrap";
import Cookies from "universal-cookie";
import axios from "axios";
import { API_BASE_URL } from '../constants.js';
import Swal from 'sweetalert2';

import './HomeTecnical.css'

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableContainer from  '@mui/material/TableContainer';
import { Paper } from '@mui/material';

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
                                {/* { info["my_tickets"].map((ticket) => {
                                    return (
                                        <tr>
                                            <td>{ticket.ticketId}</td>
                                            <td>{ticket.situation}</td>
                                            <td>{ticket.client}</td>
                                            <td>{ticket.openDate}</td>
                                            <td>{ticket.modificationDate}</td>
                                            <td>{ticket.priority}</td>
                                            { 
                                                (ticket.statusid == 9 ) ?
                                                    <td>{ticket.status}</td>
                                                :
                                                    (ticket.statusid == 7) ?
                                                        <td>{ticket.status}</td>
                                                        :
                                                        (ticket.statusid == 6) ? 
                                                        <td>
                                                            <Button onClick={() => {
                                                                setModalType(3);
                                                                handleShow();
                                                                setCurrentTicket(ticket);
                                                            }} variant='warning' style={{borderRadius:20}}>Retomar</Button>
                                                        </td>
                                                        :
                                                        <td>
                                                            <Button onClick={() => {
                                                                setModalType(2);
                                                                handleShow();
                                                                setCurrentTicket(ticket);
                                                            }} variant='warning' style={{borderRadius:20}}>Pausar</Button>
                                                            <Button onClick={() => {
                                                                setModalType(1);
                                                                handleShow();
                                                                setCurrentTicket(ticket);
                                                            }} variant='secondary' style={{borderRadius:20}}>Cerrar</Button>
                                                        </td>
                                            }
                                        </tr>
                                    )
                                })}      */}
                            </tbody>
                        </Table>
                    </Box>
                </TableContainer>
            </Row>                
        </div>        
    )
}


function RowTicket(props){    

    const [ticketResultTechnical, setticketResultTechnical] = React.useState([]);

    const [show, setShow] = React.useState(false);
    const [modalType, setModalType] = React.useState(0);
    const [currentTicket, setCurrentTicket] = React.useState({});
    const handleClose = () => setShow(0);
    const handleShow = () => setShow(true);
    const [comment, setComment] = useState("");
    const onChange = (event) => {
        setComment(event.target.value);
    }
    
    // const [ticketResultDecline, setticketResultDecline] = React.useState({
    // "@p_ticketHistoyID": 0,
    // "@p_result": 0,
    // "@p_message": ""
    // });

    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [ticketHist, setTicketHist] =  React.useState({
        "ticketsHistory": []
    });

    const updateTicket = (newStatus, comment) =>  {

        var message = "";                       
        
        axios.put(`${API_BASE_URL}/homeT/update_ticket`,{
            p_userId:cookies.get("USER_TOKEN"),
            p_ticketId:currentTicket.ticketId,
            p_statusId:newStatus,
            p_comment:comment,            
            p_technicalId: currentTicket.technicalId
         })
         .then((res) => {            
            setticketResultTechnical(res.data);            
            console.log(ticketResultTechnical["@p_ticketHistoyID"]);
        });

        if(ticketResultTechnical["@p_result"] != 0){
            if(modalType == 1) {
                
                var fileInputTechnical = document.getElementById("fileEvindece");
                if ('files' in fileInputTechnical) {
                    if (fileInputTechnical.files.length == 0) {
                        message = "¡Ingresar al menos una evidencia!";
                    }
                    else{
                        
                        for (var i = 0; i < fileInputTechnical.files.length; i++) {                    
                            var file = fileInputTechnical.files[i];                                                     
                            const reader = new FileReader();                    
                            reader.onloadend = () => {                        
                                const base64String = reader.result;                                                                                                                                   
                                axios.post(`${API_BASE_URL}/homeT/add_evidences`,{
                                    p_ticketHistoryId:ticketResultTechnical["@p_ticketHistoyID"],
                                    p_evidencia:base64String                                   
                                    }).then((res) =>{
                                        console.log(base64String);
                                    });
                                    
                            };
                            reader.readAsDataURL(file);                    
                            
                        }
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
                Swal.fire({
                    icon: 'success',
                    title: '¡Ticket enviado a revisión!'
                })
            } else{
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
                
            }
                        
        }
        else{

            Swal.fire({
                icon: 'success',
                title: ""+ ticketResultTechnical["@p_message"] + ""
              })
        }        
     

        setComment("");
    }
 
    axios.get(`${API_BASE_URL}/homeC/getTicketHistoryHome/${row.ticketId}`, { cancelToken: cancelTokenSource.token })        
        .then((res) => {                               
            setTicketHist(res.data);
        }).catch((err) => handleError(err));
        
    return(        
        <React.Fragment>
            <>
                <Modal show={show} onHide={handleClose} style={{color:"#66CCC5"}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ticket: {currentTicket.ticketId}</Modal.Title>
                    </Modal.Header>
                    {
                        (modalType == 1) ?
                        <Row className='rowTecnical'>
                            <Modal.Body>
                                <Form>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Comentarios</InputGroup.Text>
                                    <Form.Control id="txtComment" as="textarea" aria-label="With textarea" style={{height:'5rem'}} required value={comment} onChange={(e) => onChange(e)}/>
                                </InputGroup>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Evidencias 
                                    </InputGroup.Text>
                                    <Form.Control id="fileEvindece" type="file" accept=".png,.jpg,.jpeg" multiple/><br></br>                        
                                </InputGroup>
                                
                                <Button variant="primary" onClick={handleClose}>
                                        Cancelar
                                </Button>
                                <Button variant="primary" onClick={ (event) => {
                                    handleClose();
                                    updateTicket(7, comment);
                                    }}
                                    style={{margin:'1rem'}}>
                                    Solicitar cierre
                                </Button>
                                    
                                </Form>
                            </Modal.Body>
                        </Row>
                            :
                            (modalType == 2) ?
                            <>
                                <Modal.Body >
                                <InputGroup className='mb-2'>
                                    ¿Estas seguro de que deseas pausar el ticket?
                                </InputGroup>                                   

                                <InputGroup className='mb-2'>
                                    <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Motivo</InputGroup.Text>
                                    <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => onChange(e)}/>                                    
                                </InputGroup>                                   
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" onClick={() => {
                                        handleClose();
                                        updateTicket(6, comment);
                                    }}>
                                        Pausar ticket
                                    </Button>
                                </Modal.Footer>                               
                            </>
                            :
                            <>
                                <Modal.Body>                                        
                                    <InputGroup className='mb-2'>
                                        ¿Deseas retomar el ticket?
                                    </InputGroup>                                   
                                    <InputGroup className='mb-2'>
                                        <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Motivo</InputGroup.Text>
                                        <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => onChange(e)}/>
                                    </InputGroup>                                   
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" onClick={() => {
                                        handleClose();
                                        updateTicket(5, comment);
                                    }}>
                                        Retomar ticket
                                    </Button>
                                </Modal.Footer>                               
                            </>
                    }
                </Modal>
            </>             
            <tr  sx={{ '& > *': { borderBottom: 'unset' } }}>
                <td component="th" scope='row'>                                   
                    <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}                        >
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
                        <td>{row.status}</td>
                    :
                        (row.statusid == 7) ?
                            <td>{row.status}</td>
                            :
                            (row.statusid == 6) ? 
                            <td>
                                <Button onClick={() => {
                                    setModalType(3);
                                    handleShow();
                                    setCurrentTicket(row);
                                }} variant='warning' style={{borderRadius:20}}>Retomar</Button>
                            </td>
                            :
                            <td>
                                <Button onClick={() => {
                                    setModalType(2);
                                    handleShow();
                                    setCurrentTicket(row);
                                }} variant='warning' style={{borderRadius:20}}>Pausar</Button>
                                <Button onClick={() => {
                                    setModalType(1);
                                    handleShow();
                                    setCurrentTicket(row);
                                }} variant='secondary' style={{borderRadius:20}}>Cerrar</Button>
                            </td>
                }
            </tr>                                    
            <tr>
                <td  style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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