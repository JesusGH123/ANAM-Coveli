import { useEffect , useState, Fragment } from 'react';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/src/collapse.js';
import { Col, Row,  Container, Nav, Navbar, Button, Modal,NavDropdown, Table, Form, FormGroup, Tab, Select, option, InputGroup} from "react-bootstrap";
import Swal from 'sweetalert2';

import './HomeMonitorist.css'

import axios from 'axios';
import { API_BASE_URL } from '../constants.js';
import Cookies from 'universal-cookie';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableContainer from  '@mui/material/TableContainer';
import { Paper, alertTitleClasses } from '@mui/material';
import excludeVariablesFromRoot from '@mui/material/styles/excludeVariablesFromRoot';


const cookies = new Cookies();

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}



export default function HomeMonitorist(){

    const CancelToken = axios.CancelToken;
    const cancelTokenSource = CancelToken.source();    
    const [username, setUsername] = React.useState("");
    const [useremail, setUseremail] = React.useState("");// const [show, setShow] = useState(false);        

    const [tickets, setTickets] = React.useState({        
        "recent_tickets": [],
        "reassigned_tickets": []
    });   

    const [dashboard, setDashboard] = React.useState({        
        "assigned": 0,"revision": 0,"reassigned": 0, "open": 0,"paused": 0,"closed": 0
    });   


    const logout = () => {
        const cookies = new Cookies();
        cookies.remove("USER_TOKEN", {path: "/"});
        window.location.href = "/";
    }    
    
    useEffect(() => {                
        axios.get(`${API_BASE_URL}/users/user/${cookies.get("USER_TOKEN")}`, {cancelToken: cancelTokenSource.token})
            .then((res) => {                                
                setUseremail(res.data["EMAIL"]);
                setUsername(res.data["FULLNAME"]);                
            }).catch((e) =>{
                handleError(e);
            });      
        axios.get(`${API_BASE_URL}/homeM/getMonitoristHome`, {cancelToken: cancelTokenSource.token})
            .then((res) => {                                                
                setTickets(res.data);                  
            }).catch((e) =>{
                handleError(e);                
            });  
        axios.get(`${API_BASE_URL}/homeM/getDasboardHome`, {cancelToken: cancelTokenSource.token})
            .then((res) => {                
                setDashboard(res.data);  

            }).catch((e) =>{
                handleError(e);
            });  
    });


    return(
    <div>
    <div>
    <Navbar expand="md" className="bg-body-tertiary">                
        <Container id='containerNav'>
            <Navbar.Brand><img className="imgNav" alt="LTP Global Software" src="/images/logo.png" /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/homeM" style={{fontWeight:'bold'}} onClick={()=>{cancelTokenSource.cancel('Operation canceled')}}>Home</Nav.Link>
                </Nav>                        
                <Row>
                    <Col>
                    <img src='/images/user.png' style={{width:'2.5rem', height:'2.5rem'}}></img>
                    </Col>
                    <Col>
                        <NavDropdown title={username} id="basic-nav-dropdown" style={{textAlign:'right', fontWeight:'bold'}} drop='down-centered'>
                            <NavDropdown.Item onClick={() => {cancelTokenSource.cancel('Operation canceled'); logout();}}>Cerrar Sesión</NavDropdown.Item>                            
                        </NavDropdown>                        
                        <label style={{color:'#51177D'}}>
                            {useremail}
                        </label>                        
                    </Col>
                </Row>                        
            </Navbar.Collapse>            
        </Container>                        
    </Navbar>
    </div>
    <Row>        
        <Col lg={4}>
            <div className="dashboardButtonMonitorist">
                <Row>
                    <Col xs={8} style={{fontSize:'1.2rem'}} >
                        Tickets asignados
                        <h2 style={{ fontSize:'4rem'}}>{dashboard["assigned"]}</h2>
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
        <Col lg={4}>
            <div className="dashboardButtonMonitorist">
                <Row>
                    <Col xs={8} style={{fontSize:'1.2rem'}} >
                        Tickets con petición de cierre
                        <h2 style={{ fontSize:'4rem'}}>{dashboard["revision"]}</h2>
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
        <Col lg={4}>
            <div className="dashboardButtonMonitorist">
                <Row>
                    <Col xs={8} style={{fontSize:'1.2rem'}} >
                        Tickets con reincidencia
                        <h2 style={{ fontSize:'4rem'}}>{dashboard["reassigned"]}</h2>
                    </Col>
                    <Col xs={1}>
                        <div className="divSeparator"></div>
                    </Col>
                    <Col xs={3} style={{marginTop:"1rem"}} >                                
                        <img className="imgInformation" src="/images/pregunta.png"></img>
                    </Col>
                </Row>                                        
            </div>
        </Col>
    </Row>            
    <Row>        
        <Col lg={4}>
            <div className="dashboardButtonMonitorist">
                <Row>
                    <Col xs={8} style={{fontSize:'1.2rem'}} >
                        Tickets abiertos
                        <h2 style={{ fontSize:'4rem'}}>{dashboard["open"]}</h2>
                    </Col>
                    <Col xs={1}>
                        <div className="divSeparator"></div>
                    </Col>
                    <Col xs={3} style={{marginTop:"1rem"}} >                                
                        <img className="imgInformation" src="/images/informacion.png"></img>
                    </Col>
                </Row>                                        
            </div>
        </Col>
        <Col lg={4}>
            <div className="dashboardButtonMonitorist">
                <Row>
                    <Col xs={8} style={{fontSize:'1.2rem'}} >
                        Tickets pausados
                        <h2 style={{ fontSize:'4rem'}}>{dashboard["paused"]}</h2>
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
        <Col lg={4}>
            <div className="dashboardButtonMonitorist">
                <Row>
                    <Col xs={8} style={{fontSize:'1.2rem'}} >
                        Tickets cerrados
                        <h2 style={{ fontSize:'4rem'}}>{dashboard["closed"]}</h2>
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
    </Row>
    <Row className='graphicsArea'>
        <TableContainer component={Paper}>
            <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Tickets recientes
                        </Typography>
                <Table  striped hover responsive aria-label='customized table'>
                    <thead>
                        <tr>                                          
                        <th># Ticket</th>
                            <th>Categoria</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Situación</th>
                            <th>Prioridad</th>
                            <th>Técnico</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>                        
                        { 
                        tickets["recent_tickets"].map((row) => (
                            <RowTicket key={row.ticketId} row={row} />
                        ))
                        }                    
                    </tbody>
                </Table>
            </Box>
        </TableContainer>
    </Row>            
    <Row className='graphicsArea'>
        <TableContainer component={Paper}>
            <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Tickets con reincidencia
                        </Typography>
                <Table  striped hover responsive aria-label='customized table'>
                    <thead>
                        <tr>                                          
                            <th># Ticket</th>
                            <th>Categoria</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Situación</th>
                            <th>Prioridad</th>
                            <th>Técnico</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>                        
                        {
                        tickets["reassigned_tickets"].map((row) => (
                            <RowTicket key={row.ticketId} row={row} />
                        ))
                    }                    
                    </tbody>
                </Table>
            </Box>
        </TableContainer>
    </Row>            
    </div>
)
}


    function RowTicket(props){        
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    
    const [ticketHist, setTicketHist] =  React.useState({"ticketsHistory": []});
    const [priorities, setpriorities] =  React.useState({"priorities": []});   
    const [technicals, settechnicals] =  React.useState({"technicals": []});        
 
    const getTicketHistory = (ticketId) => {
        axios.get(`${API_BASE_URL}/homeC/getTicketHistoryHome/${ticketId}`)        
        .then((res) => {                               
            setTicketHist(res.data);            
        });
    }
    

    axios.get(`${API_BASE_URL}/homeM/getPrioritiesHome`)        
        .then((res) => {                               
            setpriorities(res.data);            
        });
    axios.get(`${API_BASE_URL}/homeM/getTechinicalsHome`)        
        .then((res) => {                               
            settechnicals(res.data);            
        });

    const asignTiciket = async (item) =>  {      
        

        await Swal.fire({
            title: '¿Desea guardar los cambios?',                        
            confirmButtonText: 'Si',
            confirmButtonColor: 'green',
            showCancelButton:true,
            cancelButtonText:"No"            
          }).then((result) => {            
            if (result.isConfirmed) {
                axios.put(`${API_BASE_URL}/homeM/updateTicket`,{
                    p_userId:cookies.get("USER_TOKEN"),
                    p_ticketId:document.getElementById("hfticketId" + item).value,
                    p_statusId:5,                    
                    p_technicalId: document.getElementById("ddlTechnical" + item).value,
                    p_priorityId: document.getElementById("ddlPriority" + item).value
                 })
                 .then((res) => {                    
                    
                    if(res.data["@p_result"] == 1){
                        Swal.fire({
                            icon: 'success',
                            title: ""+ res.data["@p_message"] + ""
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
          })        
    }

    const clearSelected = async (item) =>  {
        await Swal.fire({
            title: '¿Desea cancelar lo cambios?',            
            showCancelButton: true,
            cancelButtonText:"NO",
            confirmButtonText: 'SI',
            confirmButtonColor: 'green',                     
          }).then((result) => {            
            if (result.isConfirmed) {                
                document.getElementById("ddlPriority" + item).value=document.getElementById("hfpriority" + item).value;
                document.getElementById("ddlTechnical" + item).value=document.getElementById("hftechnicalId" + item).value;        
                Swal.fire('¡Cambios Cancelados!', '', 'success');
            } 
          })
        
    }

    return(        
        <React.Fragment>                  
            <tr  sx={{ '& > *': { borderBottom: 'unset' } }}>
                <td component="th" scope='row'>                                   
                    <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() =>{setOpen(!open); getTicketHistory(row.ticketId);}}                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}                            
                    </IconButton>                             
                    {row.ticketId}
                    <input type="hidden" id={"hfticketId" + row.ticketId}  value={row.ticketId} />
                    <input type="hidden" id={"hfpriority" + row.ticketId}  value={row.priorityId > 0 ? row.priorityId : 0 } />
                    <input type="hidden" id={"hftechnicalId" + row.ticketId}  value={row.technicalId > 0 ? row.technicalId : 0} />
                    
                </td>                
                <td>{row.category}</td>
                <td>{row.client}</td>
                <td>{row.openDate}</td>
                <td>
                    {row.situation}
                </td>
                <td>
                    <Form.Select id={"ddlPriority" + row.ticketId}>
                        <option value={0}>-- Seleccione --</option>
                        { priorities["priorities"].map((p) => {
                            return(<option value={p.priorityId} selected={row.priorityId != p.priorityId ? false : true}>{p.priority}</option>
                            )                            
                        })}                                                                                            
                    </Form.Select> 
                </td>
                <td>
                    <Form.Select id={"ddlTechnical" + row.ticketId}>
                    <option value={0}>-- Seleccione --</option>
                        { technicals["technicals"].map((t) => {
                            return(<option value={t.userId} selected={row.technicalId != t.userId ? false : true} >{t.fullName}</option>
                            )                            
                        })}                                                                                            
                    </Form.Select> 
                </td>                
                <td style={{textAlign:'center'}}><Button className='btn-save-monitoris' onClick={()=>{asignTiciket(row.ticketId);}}>Guardar</Button><Button className='btn-save-monitoris' onClick={()=>{clearSelected(row.ticketId);}}>cancelar</Button></td>
            </tr>                                    
            <tr>
                <td  style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Historial del Ticket
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <thead>
                                    <tr>
                                        <th>Estatus</th>
                                        <th>Fecha</th>
                                        <th>Comentarios</th>
                                        <th>Técnico</th>
                                        <th>Usuario</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    { ticketHist["ticketsHistory"].map((the) => {   
                                        return(<>
                                        <tr key={the.comment} component="th" scope='row'>                                                       
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



