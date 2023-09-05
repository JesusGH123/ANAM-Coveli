import { useEffect , useState, Fragment } from 'react';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/src/collapse.js';
import { Col, Row,  Container, Nav, Navbar, Button, Modal,NavDropdown, Table, Form, FormGroup, Tab, Select, option, InputGroup} from "react-bootstrap";
import Swal from 'sweetalert2';

import './HomeClient.css'

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
import { Paper } from '@mui/material';



const cookies = new Cookies();
const CancelToken = axios.CancelToken
const cancelTokenSource = CancelToken.source()

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

export default function HomeClient(){    

    const [username, setUsername] = React.useState("");
    const [useremail, setUseremail] = React.useState("");
    const [mdlNewUser, setShowNewUser] = useState(false);    
    const showNewUser = () => setShowNewUser(true);     
    const closeNewUser = () => setShowNewUser(false);

    const [info, setInfo] = React.useState({
        "tickets": []
    });       
    
    const [locations, setLocations] = React.useState([]);
    const [equipments, setEquipments] = React.useState([]);
    const [serials, setSerials] = React.useState([]);    
    

    useEffect(() =>{        
        axios.get(`${API_BASE_URL}/users/user/${cookies.get("USER_TOKEN")}`, {cancelToken: cancelTokenSource.token})
            .then((res) => {
                setUseremail(res.data["EMAIL"]);
                setUsername(res.data["FULLNAME"]);                
            }).catch((e) =>{
                handleError(e);
            });                  
        axios.get(`${API_BASE_URL}/homeC/getClientHome/${cookies.get("USER_TOKEN")}`, {cancelToken: cancelTokenSource.token})
            .then((res) => {                
                setInfo(res.data);                
            }).catch((e) =>{
                handleError(e);
            });                          
    });

    
    const logout = () => {
        const cookies = new Cookies();
        cookies.remove("USER_TOKEN", {path: "/"});
        window.location.href = "/";
    }    
    
    function getEquipmentByLocation(locationId){        
        axios.get(`${API_BASE_URL}/homeC/get_equipments_by_Location_home/${locationId}`)
                .then((res) => {                
                    setEquipments(res.data["equipments"]);     
                })
                .catch((err) => {
                    handleError(err);
                });
    }

    function getSerialsByEquipment(LocationEquipment){        
        axios.get(`${API_BASE_URL}/homeC/get_serials_by_Location_by_Location_home/${LocationEquipment.split("|")[0]}/${LocationEquipment.split("|")[1]}`, {cancelToken: cancelTokenSource.token})
                .then((res) => {                
                    setSerials(res.data["serials"]);     
                })
                .catch((err) => handleError(err));
    }
    function clearEquimentsSerials(){
        setEquipments([]);
        setSerials([]);

    }   

    function showNewTicket(){
        axios.get(`${API_BASE_URL}/homeC/get_equipmentsLocations_home/`, {cancelToken: cancelTokenSource.token})
            .then((res) => {                
                setLocations(res.data["locations"]);     
            }).catch((err) => handleError(err));
        showNewUser();
    }

    async function addTicket() {               
        let userId = cookies.get("USER_TOKEN");
        var message = "";
        var fileInput = document.getElementById("fileEvindece");
        var info = document.getElementById ("info");
        info.innerHTML = message;

        
        axios.post(`${API_BASE_URL}/homeC/add_ticket`,{
            p_categoryId:document.getElementById("ddlCategory").value,
            p_equipmentLocationId:document.getElementById("ddlLocation").value,
            p_equipmentModelId:document.getElementById("ddlEquipment").value.split("|")[1],
            p_equipmentSerialId:document.getElementById("ddlSerial").value,            
            p_situation: document.getElementById("txtSituation").value,
            p_comment: document.getElementById("txtComment").value,
            p_userid: userId, 
         })
         .then((res) => {
            if(res.data["@p_result"] == 1){
                if ('files' in fileInput) {
                    if (fileInput.files.length == 0) {
                        message = "¡Ingresar al menos una evidencia!";
                    }
                    else{
                        for (var i = 0; i < fileInput.files.length; i++) {                    
                            var file = fileInput.files[i];                                                     
                            const reader = new FileReader();                    
                            reader.onloadend = () => {                        
                                const base64String = reader.result;                                            
                                console.log(base64String);
                                axios.post(`${API_BASE_URL}/homeC/add_evidences`,{
                                    p_ticketHistoryId:res.data["@p_ticketHistoyID"],
                                    p_evidencia:base64String                                   
                                    });
                            };
                            reader.readAsDataURL(file);                    
                        }
                    }
        
                }
                else {
                    if (fileInput.value == "") {
                        message += "Please browse for one or more files.";
                        message += "<br />Use the Control or Shift key for multiple selection.";
                    }
                    else {
                        message += "Your browser doesn't support the files property!";
                        message += "<br />The path of the selected file: " + fileInput.value;
                    }
                }
    
                Swal.fire({
                    icon: 'success',
                    title: ""+ res.data["@p_message"] + ""
                  })
        
                closeNewUser();
            }
            else{
    
                Swal.fire({
                    icon: 'error',
                    title: ""+ res.data["@p_message"] + ""
                  })
            }
        });        
        
        
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
                            <Nav.Link href="/homeC" style={{fontWeight:'bold'}} onClick={()=>{cancelTokenSource.cancel('Operation canceled')}}>Home</Nav.Link>
                        </Nav>                         
                        <div>
                            <Row>
                                <Col>
                                <img src='/images/user.png' style={{width:'2.5rem', height:'2.5rem'}}></img>
                                </Col>
                                <Col>
                                    <NavDropdown title={username} id="basic-nav-dropdown" style={{textAlign:'right', fontWeight:'bold'}} drop='down-centered'>
                                        <NavDropdown.Item onClick={() => { cancelTokenSource.cancel('Operation canceled'); logout(); }}>Cerrar Sesión</NavDropdown.Item>                            
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
            
            <Row>
                <Col lg={8}>                
                    <Button className='btn-new-client'  onClick={ showNewTicket} >
                        Nuevo ticket
                    </Button>
                </Col>
                <Col lg={4}>
                    <div className="dashboardButtonCliente">
                        <Row>
                            <Col xs={8} style={{fontSize:'1.2rem'}} >
                                Tickets levantados
                                <h2 style={{ fontSize:'4rem'}}>{info["all_tickets"]}</h2>
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
            <Row className='graphicsArea'>
                <TableContainer component={Paper}>
                <Box sx={{ margin: 1 }}>
                            <Typography variant="h4" gutterBottom component="div">
                                Tickets
                            </Typography>
                    <Table  striped hover responsive aria-label='customized table'>
                        <thead>
                            <tr>                                          
                                <th># Ticket</th>
                                <th>Category</th>
                                <th>Fecha creación</th>
                                <th>Fecha modificación</th>
                                <th>Prioridad</th>
                                <th style={{textAlign:'center'}}>Validación</th>
                            </tr>
                        </thead>
                        <tbody>                        
                            { info["tickets"].map((row) => (
                                <RowTicket key={row.ticketId} row={row} />
                            ))}                    
                        </tbody>
                    </Table>
                </Box>
                </TableContainer>
            </Row>

            <Modal show={mdlNewUser} onHide={closeNewUser} style={{color:"#66CCC5"}}>
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>                    
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Categoria
                        </InputGroup.Text>
                        <Form.Select id="ddlCategory" required>
                            <option value={0}>-- Seleccione --</option>
                            <option value={1}>Incidencia</option>
                            <option value={2}>Siniestro</option>
                        </Form.Select>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                    <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}} hasValidation>Situación
                        </InputGroup.Text>
                        <Form.Control type='text' id='txtSituation' required/>
                        
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text  style={{color:"#66CCC5", fontWeight:'bold'}}>Ubicación
                        </InputGroup.Text>
                        <Form.Select id="ddlLocation" onChange={ (e) => e.target.value > 0 ? getEquipmentByLocation(e.target.value) : clearEquimentsSerials()} required>
                            <option value={0}>-- Seleccione --</option>
                        { locations.map((l) => {
                            return(<option value={l.equipmentlocationId} >{l.equipmentlocation}</option>
                            )                            
                        })}                                                                    
                        </Form.Select>
                    </InputGroup>                                         
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Modelo
                        </InputGroup.Text>
                        <Form.Select id="ddlEquipment" onChange={ (e) => e.target.value != 0 ? getSerialsByEquipment(e.target.value) : setSerials([]) } required>
                        <option value={0}>-- Seleccione --</option>
                        { equipments.map((eq) => {
                            return(<option value={eq.equipmentLocationId +"|"+ eq.equipmentModelId} >{eq.equipmentModel}</option>
                            )                            
                        })}                                                                    
                        </Form.Select>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>No. de Serie
                        </InputGroup.Text>
                        <Form.Select id="ddlSerial" required>
                        <option value={0}>-- Seleccione --</option>
                        { serials.map((s) => {
                            return(<option value={s.equipmentSerialId} >{s.equipmentSerial}</option>
                            )                            
                        })}                                                                                            
                        </Form.Select>
                    </InputGroup>                         
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Comentarios</InputGroup.Text>
                        <Form.Control id="txtComment" as="textarea" aria-label="With textarea" style={{height:'5rem'}} required/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Evidencias 
                        </InputGroup.Text>
                        <Form.Control id="fileEvindece" type="file" accept=".png,.jpg,.jpeg" multiple/><br></br>                        
                    </InputGroup>
                    <div id="info" style={{marginTop:"30px", color:'red'}}></div>
                    <InputGroup className='mb-2'>
                        <Button className='btn-new-client' onClick={addTicket}>
                            Crear ticket
                        </Button>
                    </InputGroup>
                </Modal.Body>                        
            </Modal> 

            
        </div>        
    )
}

function RowTicket(props){

    var currentdate = new Date(); 
    var datetime = (currentdate.getMonth()+1) + "/"
                    + currentdate.getDate()  + "/" 
                    + currentdate.getFullYear() + " "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();    
    
    const [mdlDecline, setShowDecline] = useState(false);    
    const showDecline = () => setShowDecline(true);     
    const closeDecline = () => setShowDecline(false);   
    const [ticketResultDecline, setticketResultDecline] = React.useState({
    "@p_ticketHistoyID": 0,
    "@p_result": 0,
    "@p_message": ""
    });

    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [ticketHist, setTicketHist] =  React.useState({
        "ticketsHistory": []
    });

     
    const declineTciket =  async () =>  {

        var message = "";
        var fileInputDecline = document.getElementById("fileEvindeceDecline");
        console.log(document.getElementById("ticketID").value);
        axios.put(`${API_BASE_URL}/homeC/update_ticket`,{
            p_userId:cookies.get("USER_TOKEN"),
            p_ticketId:document.getElementById("ticketID").value,
            p_statusId:8,
            p_comment:document.getElementById("txtCommentDecline").value,            
            p_technicalId: 0
         })
         .then((res) => {
            console.log(res.data);
            setticketResultDecline(res.data);            
        });

        if(ticketResultDecline["@p_result"] != 0){
            if ('files' in fileInputDecline) {
                if (fileInputDecline.files.length == 0) {
                    message = "¡Ingresar al menos una evidencia!";
                }
                else{
                    for (var i = 0; i < fileInputDecline.files.length; i++) {                    
                        var file = fileInputDecline.files[i];                                                     
                        const reader = new FileReader();                    
                        reader.onloadend = () => {                        
                            const base64String = reader.result;    
                            console.log(ticketResultDecline["@p_ticketHistoyID"]);                                                                                                
                            axios.post(`${API_BASE_URL}/homeC/add_evidences`,{
                                p_ticketHistoryId:ticketResultDecline["@p_ticketHistoyID"],
                                p_evidencia:base64String                                   
                                });
                        };
                        reader.readAsDataURL(file);                    
                    }
                }
    
            }
            else{
                if (fileInputDecline.value == "") {
                    message += "Please browse for one or more files.";
                    message += "<br />Use the Control or Shift key for multiple selection.";
                }
                else {
                    message += "Your browser doesn't support the files property!";
                    message += "<br />The path of the selected file: " + fileInputDecline.value;
                }
            }

            await Swal.fire({
                icon: 'success',
                title: ""+ ticketResultDecline["@p_message"] + ""
              })
    
            closeDecline();
        }
        else{

            await Swal.fire({
                icon: 'error',
                title: ""+ ticketResultDecline["@p_message"] + ""
              })
        }
    }
 
    axios.get(`${API_BASE_URL}/homeC/getTicketHistoryHome/${row.ticketId}`, { cancelToken: cancelTokenSource.token })        
        .then((res) => {                               
            setTicketHist(res.data);
        }).catch((err) => handleError(err));
        
    return(        
        <React.Fragment>
            <>
            <Modal show={mdlDecline} onHide={closeDecline} style={{color:"#66CCC5"}}>
                <Modal.Header closeButton>
                    <Modal.Title>Rechazar el Ticket ({row.ticketId})</Modal.Title>
                </Modal.Header>
                <Modal.Body>             
                    <input type="hidden" id="ticketID" name="ticketId" value={row.ticketId} />                           
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Comentarios</InputGroup.Text>
                        <Form.Control id="txtCommentDecline" as="textarea" aria-label="With textarea" style={{height:'5rem'}} required/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Evidencias 
                        </InputGroup.Text>
                        <Form.Control id="fileEvindeceDecline" type="file" accept=".png,.jpg,.jpeg" multiple/><br></br>                        
                    </InputGroup>
                    <div id="info" style={{marginTop:"30px", color:'red'}}></div>
                    <InputGroup className='mb-2'>
                        <Button className='btn-new-client' onClick={declineTciket} >
                            Crear ticket
                        </Button>
                    </InputGroup>
                </Modal.Body>                        
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
                <td>{row.category}</td>
                <td>{row.openDate}</td>
                <td>{row.modificationDate}</td>
                <td>{row.priority}</td>
                <td style={{textAlign:'center'}}>{(row.statusid == 9 && (Math.abs(new Date(row.modificationDate) - currentdate)/ 36e5) <= 2)  ? <Button variant='danger' style={{borderRadius:'3rem'}} onClick={showDecline}>No resuelto</Button>:row.status}</td>
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

