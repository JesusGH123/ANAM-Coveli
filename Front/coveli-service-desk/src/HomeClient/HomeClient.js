import { useEffect , useState } from 'react';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/src/collapse.js';
import { Col, Row, Button, Modal, Table, Form, InputGroup} from "react-bootstrap";
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
import { Paper} from '@mui/material';
import NavigationBar from '../Navbar/Navbar';
import { styled } from '@mui/system';
import {
  TablePagination,
  tablePaginationClasses as classes,
} from '@mui/base/TablePagination';

const cookies = new Cookies();
const CancelToken = axios.CancelToken
const cancelTokenSource = CancelToken.source()

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

export default function HomeClient(){    
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [mdlNewUser, setShowNewUser] = useState(false);    
    const showNewUser = () => setShowNewUser(true);     
    const closeNewUser = () => setShowNewUser(false);

    const [isAccesible, setIsAccesible] = React.useState(false);
    const [info, setInfo] = React.useState({
        "tickets": []
    }); 
    
    const [locations, setLocations] = React.useState([]);
    const [equipments, setEquipments] = React.useState([]);
    const [serials, setSerials] = React.useState([]);    
    
    useEffect(() => {
        axios.post(`${API_BASE_URL}/users/checkPermissions`, {
            userId: cookies.get("USER_TOKEN"),
            nextPath: '/homeC'
        }).then((res) => {
            if(res.data)
                setIsAccesible(true);
            else
                window.location.href = "/";
        })
    }, [])
    
    useEffect(() =>{
        if(cookies.get("USER_TOKEN")) {
            axios.get(`${API_BASE_URL}/homeC/getClientHome/${cookies.get("USER_TOKEN")}`, {cancelToken: cancelTokenSource.token})
            .then((res) => {             
                setInfo(res.data);                
            }).catch((e) =>{
                handleError(e);
            });                          
        }
    });
    
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
        if ('files' in fileInput) {
            if(document.getElementById("ddlCategory").value == 0){
                message = "¡Seleccione una Categoría!";
            }
            else if(document.getElementById("txtSituation").value == ""){
                message = "¡Ingrese la situación!";
            }
            else if(document.getElementById("txtSituation").value.length > 50){
                message = "¡Máximo 50 caracteres!";
            }
            else if(document.getElementById("ddlLocation").value == 0){
                message = "¡Seleccione una Ubicación!";
            }
            else if(document.getElementById("ddlEquipment").value == 0){
                message = "¡Seleccione un Equipo!";
            }
            else if(document.getElementById("ddlSerial").value == 0){
                message = "¡Seleccione un número de Serie!";
            }            
            else if(document.getElementById("txtComment").value == ""){
                message = "¡Ingrese los comentarios!";
            }
            else if(document.getElementById("txtComment").value.length > 2000){
                message = "¡Máximo 2000 caracteres!";
            }
            else if (fileInput.files.length == 0) {
                message = "¡Ingresar al menos una imagen de evidencia!";
            
            }
            else if(fileInput.files.length > 2){
                message = "¡Ingresar máximo dos imágenes de evidencia!";
            }                        
            else{
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
                        for (var i = 0; i < fileInput.files.length; i++) {                                                
                            var file = fileInput.files[i];
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
                               axios.post(`${API_BASE_URL}/homeC/add_evidences`,{
                                p_ticketHistoryId:res.data["@p_ticketHistoryID"],                                   
                                p_evidencia: convertedImg
                                });
                            }                            
                            webpImg.src = currentImg;
                        }
                        closeNewUser(); 
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
        var info = document.getElementById ("infoNew");
        info.innerHTML = message;
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - info["tickets"].length) : 0;    

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return(
        <div>
            {
                (isAccesible) ?
                <>
                <div>
                <NavigationBar/>
                    </div>            
                    
                    <Row>
                        <Col lg={7}>                
                            <Button className='btn-new-client'  onClick={ showNewTicket} >
                                Nuevo ticket
                            </Button>
                        </Col>
                        <Col xl={1}></Col>
                        <Col lg={4}>
                            <div className="dashboardButtonCliente">
                                <Row>
                                    <Col xs={7} style={{fontSize:'1.2rem'}} >
                                        Tickets levantados
                                        <h2 style={{ fontSize:'4rem'}}>{info["all_tickets"]}</h2>
                                    </Col>
                                    <Col xs={1}>
                                        <div className="divSeparator"></div>
                                    </Col>
                                    <Col xs={2} style={{marginTop:"1rem"}} >                                
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
                            <Table  striped hover responsive aria-label='custom pagination table'>
                                <thead>
                                    <tr>                                          
                                        <th># Ticket</th>
                                        <th>Ubicación</th>
                                        <th>Equipo</th>
                                        <th>Serie</th>
                                        <th>Category</th>
                                        <th>Fecha creación</th>
                                        <th>Fecha modificación</th>
                                        <th>Prioridad</th>
                                        <th style={{textAlign:'center'}}>Validación</th>
                                    </tr>
                                </thead>
                                <tbody>               
                                    {(rowsPerPage > 0 ?info["tickets"].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage):                               
                                    info["tickets"]).map((row) => (<RowTicket key={row.ticketId} row={row} />))
                                    }  
                                    {emptyRows > 0 && (
                                        <tr style={{ height: 34 * emptyRows }}>
                                        <td colSpan={10} aria-hidden />
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <CustomTablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                                        colSpan={10}
                                        count={info["tickets"].length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        slotProps={{
                                            select: {
                                            'aria-label': 'Tickets por pagina',
                                            },                                    
                                            actions: {
                                            showFirstButton: true,
                                            showLastButton: true,
                                            },
                                        }}
                                        labelRowsPerPage = {'Tickets por pagina'}                                
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}                                
                                        />
                                    </tr>
                                </tfoot>
                            </Table>
                        </Box>
                        </TableContainer>
                    </Row>

                    <Modal show={mdlNewUser} onHide={closeNewUser} style={{color:"#66CCC5"}}>
                        <Modal.Header closeButton className='modal-width'>
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
                            <div id="infoNew" style={{marginTop:"30px", color:'red'}}></div>                    
                        </Modal.Body>
                        <Modal.Footer>
                            <InputGroup className='mb-2'>                        
                                <Button className='btn-new-client' onClick={addTicket}>
                                    Crear ticket
                                </Button>
                            </InputGroup>
                        </Modal.Footer>                        
                    </Modal>
                </>
                :
                null
            }
        </div>        
    )
}

const blue = {
    50: '#F0F7FF',
    200: '#A5D8FF',
    400: '#3399FF',
    900: '#003A75',
  };

const grey = {
    50: '#F3F6F9',
    100: '#E7EBF0',
    200: '#E0E3E7',
    300: '#CDD2D7',
    400: '#B2BAC2',
    500: '#A0AAB4',
    600: '#6F7E8C',
    700: '#3E5060',
    800: '#2D3843',
    900: '#1A2027',
  };
  
const CustomTablePagination = styled(TablePagination)(
    ({ theme }) => `
    & .${classes.spacer} {
      display: none;
    }
  
    & .${classes.toolbar}  {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
  
      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
      }
    }
  
    & .${classes.selectLabel} {
      margin: 0;
    }
  
    & .${classes.select}{
      padding: 2px;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
      border-radius: 50px;
      background-color: transparent;
  
      &:hover {
        background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      }
  
      &:focus {
        outline: 1px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
      }
    }
  
    & .${classes.displayedRows} {
      margin: 0;
  
      @media (min-width: 768px) {
        margin-left: auto;
      }
    }
  
    & .${classes.actions} {
      padding: 2px;
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
      border-radius: 50px;
      text-align: center;
    }
  
    & .${classes.actions} > button {
      margin: 0 8px;
      border: transparent;
      border-radius: 2px;
      background-color: transparent;
  
      &:hover {
        background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      }
  
      &:focus {
        outline: 1px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
      }
    }
    `,
  );

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

    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [ticketHist, setTicketHist] =  React.useState({
        "ticketsHistory": []
    });
     
    const declineTciket =  async () =>  {
        var message = "";
        var fileInput = document.getElementById("fileEvindece");

        if ('files' in fileInput) {
            if(document.getElementById("txtCommentDecline").value == ""){
                message = "¡Ingresar comentarios!";
            }
            else if (fileInput.files.length == 0) {
                message = "¡Ingresar al menos una imagen de evidencia!";
            
            }
            else if(fileInput.files.length > 2){
                message = "¡Ingresar máximo dos imágenes de evidencia!";
            }            
            else{
                axios.put(`${API_BASE_URL}/homeC/update_ticket`,{
                    p_userId:cookies.get("USER_TOKEN"),
                    p_ticketId:document.getElementById("ticketID").value,
                    p_statusId:8,
                    p_comment:document.getElementById("txtCommentDecline").value,            
                    p_technicalId: 0
                })
                .then((res) => {
                    if(res.data["@p_result"] != 0){
                        for (var i = 0; i < fileInput.files.length; i++) {
                            var file = fileInput.files[i];                                                     
                            const reader = new FileReader();                    
                            reader.onloadend = () => {                        
                                const base64String = reader.result;                                    
                                axios.post(`${API_BASE_URL}/homeC/add_evidences`,{
                                    p_ticketHistoryId:res.data["@p_ticketHistoryID"],
                                    p_evidencia:base64String                                   
                                    });
                            };
                            reader.readAsDataURL(file);
                        }
                        Swal.fire({
                            icon: 'success',
                            title: ""+ res.data["@p_message"] + ""
                        })                
                        closeDecline();
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: ""+ res.data["@p_message"] + ""
                        })
                    }
                });
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
        var info = document.getElementById ("infoDecline");
        info.innerHTML = message;  
    }

    const getTicketHistory = (ticketId) => {
        axios.get(`${API_BASE_URL}/homeC/getTicketHistoryHome/${ticketId}`, {cancelToken: cancelTokenSource.token})        
        .then((res) => {                               
            setTicketHist(res.data);            
        })
        .catch((err) => handleError(err));
    }        
    
    return(        
        <React.Fragment>
            <Modal show={mdlDecline} onHide={closeDecline} style={{color:"#66CCC5"}}>
                <Modal.Header closeButton>
                    <Modal.Title>Rechazar el Ticket ({row.ticketId})</Modal.Title>
                </Modal.Header>
                <Modal.Body >             
                    <input type="hidden" id="ticketID" name="ticketId" value={row.ticketId} />                           
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Comentarios</InputGroup.Text>
                        <Form.Control id="txtCommentDecline" as="textarea" aria-label="With textarea" style={{height:'5rem'}} required/>
                    </InputGroup>
                    <InputGroup className='mb-2'>
                        <InputGroup.Text style={{color:"#66CCC5", fontWeight:'bold'}}>Evidencias 
                        </InputGroup.Text>
                        <Form.Control id="fileEvindece" type="file" accept=".png,.jpg,.jpeg" multiple/><br></br>                        
                    </InputGroup>
                    <div id="infoDecline" style={{marginTop:"30px", color:'red'}}></div>                    
                </Modal.Body>
                <Modal.Footer>
                    <InputGroup className='mb-2'>
                        <Button className='btn-new-client' onClick={declineTciket} >
                            Crear ticket
                        </Button>
                    </InputGroup>
                </Modal.Footer>
            </Modal>                        

            <tr sx={{ '& > *': { borderBottom: 'unset' } }}>
                <td component="th" scope='row'>                                   
                    <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() =>{setOpen(!open); getTicketHistory(row.ticketId);}}                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}                            
                    </IconButton>                             
                    {row.ticketId}
                </td>                
                <td>{row.equipmentLocation}</td>
                <td>{row.equipmentModel}</td>
                <td>{row.equipmentSerial}</td>
                <td>{row.category}</td>                
                <td>{row.openDate}</td>
                <td>{row.modificationDateDisplay}</td>
                <td>{row.priority}</td>
                <td style={{textAlign:'center'}}>{row.statusid == 9 && (Math.abs(new Date(row.modificationDate) - currentdate)/ 36e5) <= 2  ? <Button variant='danger' style={{borderRadius:'3rem'}} onClick={()=> {showDecline(); }}>No resuelto</Button>: row.status}</td>
            </tr>                                    
            <tr>
                <td  style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
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

