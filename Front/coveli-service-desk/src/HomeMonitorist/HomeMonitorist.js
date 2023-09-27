import { useEffect } from 'react';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/src/collapse.js';
import { Col, Row, Button, Table, Form } from "react-bootstrap";
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
import { Paper} from '@mui/material';
import NavigationBar from '../Navbar/Navbar';
import { styled } from '@mui/system';
import {
  TablePagination,
  tablePaginationClasses as classes,
} from '@mui/base/TablePagination';

const CancelToken = axios.CancelToken;
const cancelTokenSource = CancelToken.source();   
const cookies = new Cookies();

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

export default function HomeMonitorist(){  
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [isAccesible, setIsAccesible] = React.useState(false);      
    const [tickets, setTickets] = React.useState({        
        "recent_tickets": [],
        "reassigned_tickets": [],
        "priorities":[],
        "technicals":[]
    });   

    const [dashboard, setDashboard] = React.useState({        
        "assigned": 0,"revision": 0,"reassigned": 0, "open": 0,"paused": 0,"closed": 0
    });

    useEffect(() => {
        axios.post(`${API_BASE_URL}/users/checkPermissions`, {
            userId: cookies.get("USER_TOKEN"),
            nextPath: '/homeM'
        }).then((res) => {
            if(res.data)
                setIsAccesible(true)
            else
                window.location.href = "/";
        })
    }, [])

    useEffect(() => {
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

    const emptyRowsRecent = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tickets["recent_tickets"].length) : 0;   
    const emptyRowsReassigned = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tickets["reassigned_tickets"].length) : 0;   

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
                    <Col>
                        <div className="dashboardButton">
                            <Row>
                                <Col xs={7} style={{fontSize:'1.2rem'}} >
                                    Tickets asignados
                                    <h2 style={{ fontSize:'4rem'}}>{dashboard["assigned"]}</h2>
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
                    <Col>
                        <div className="dashboardButton">
                            <Row>
                                <Col xs={7} style={{fontSize:'1.2rem'}} >
                                    Tickets con petición de cierre
                                    <h2 style={{ fontSize:'4rem'}}>{dashboard["revision"]}</h2>
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
                                    Tickets con reincidencia
                                    <h2 style={{ fontSize:'4rem'}}>{dashboard["reassigned"]}</h2>
                                </Col>
                                <Col xs={1}>
                                    <div className="divSeparator"></div>
                                </Col>
                                <Col xs={2} style={{marginTop:"1rem"}} >                                
                                    <img className="imgInformation" src="/images/pregunta.png"></img>
                                </Col>
                            </Row>                                        
                        </div>
                    </Col>
                </Row>            
                <Row>        
                    <Col>
                        <div className="dashboardButton">
                            <Row>
                                <Col xs={7} style={{fontSize:'1.2rem'}} >
                                    Tickets abiertos
                                    <h2 style={{ fontSize:'4rem'}}>{dashboard["open"]}</h2>
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
                                    <h2 style={{ fontSize:'4rem'}}>{dashboard["paused"]}</h2>
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
                    <Col>
                        <div className="dashboardButton">
                            <Row>
                                <Col xs={7} style={{fontSize:'1.2rem'}} >
                                    Tickets cerrados
                                    <h2 style={{ fontSize:'4rem'}}>{dashboard["closed"]}</h2>
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
                <Row className='graphicsArea'>
                    <TableContainer component={Paper}>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Tickets recientes
                            </Typography>
                            <Table  striped hover responsive aria-label='custom pagination table'>
                                <thead>
                                    <tr>                                          
                                        <th># Ticket</th>
                                        <th>Ubicación</th>
                                        <th>Equipo</th>
                                        <th>Serie</th>
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
                                    {(rowsPerPage > 0 ?tickets["recent_tickets"].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage):                               
                                    tickets["recent_tickets"]).map((row) => (<RowTicket key={row.ticketId} row={row} priorities={tickets["priorities"]} technicals={tickets["technicals"]} />))
                                    }  
                                    {emptyRowsRecent > 0 && (
                                        <tr style={{ height: 34 * emptyRowsRecent }}>
                                        <td colSpan={10} aria-hidden />
                                        </tr>
                                    )}                                   
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <CustomTablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                                        colSpan={10}
                                        count={tickets["recent_tickets"].length}
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
                <Row className='graphicsArea'>
                    <TableContainer component={Paper}>
                        <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Tickets con reincidencia
                                    </Typography>
                            <Table  striped hover responsive aria-label='custom pagination table'>
                                <thead>
                                    <tr>                                          
                                        <th># Ticket</th>
                                        <th>Ubicación</th>
                                        <th>Equipo</th>
                                        <th>Serie</th>
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
                                    {(rowsPerPage > 0 ?tickets["reassigned_tickets"].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage):                               
                                    tickets["reassigned_tickets"]).map((row) => (<RowTicket key={row.ticketId} row={row} priorities={tickets["priorities"]} technicals={tickets["technicals"]} />))
                                    }  
                                    {emptyRowsReassigned > 0 && (
                                        <tr style={{ height: 34 * emptyRowsReassigned }}>
                                        <td colSpan={10} aria-hidden />
                                        </tr>
                                    )}                                                                                      
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <CustomTablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                                        colSpan={10}
                                        count={tickets["reassigned_tickets"].length}
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
            </>
            :
            null
        }      
    </div>
)}


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

function RowTicket(props) {
    const { row } = props;        
    const { priorities } = props;
    const { technicals } = props;

    const [open, setOpen] = React.useState(false);
    
    const [ticketHist, setTicketHist] =  React.useState({"ticketsHistory": []});
    
    
    const getTicketHistory = (ticketId) => {
        axios.get(`${API_BASE_URL}/homeC/getTicketHistoryHome/${ticketId}`, {cancelToken: cancelTokenSource.token})        
        .then((res) => {                               
            setTicketHist(res.data);            
        })
        .catch((err) => handleError(err));
    }

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
                })
                .catch((ex) =>{
                    console.log(ex);
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
                <td>{row.equipmentLocation}</td>
                <td>{row.equipmentModel}</td>
                <td>{row.equipmentSerial}</td>            
                <td>{row.category}</td>
                <td>{row.client}</td>
                <td>{row.openDate}</td>
                <td>
                    {row.situation}
                </td>
                <td>
                    <Form.Select id={"ddlPriority" + row.ticketId}>
                        <option value={0}>-- Seleccione --</option>
                        { priorities.map((p) => {
                            return(<option value={p.priorityId} selected={row.priorityId != p.priorityId ? false : true}>{p.priority}</option>
                            )                            
                        })}                                                                                            
                    </Form.Select> 
                </td>
                <td>
                    <Form.Select id={"ddlTechnical" + row.ticketId}>
                    <option value={0}>-- Seleccione --</option>
                        { technicals.map((t) => {
                            return(<option value={t.userId} selected={row.technicalId != t.userId ? false : true} >{t.fullName}</option>
                            )                            
                        })}                                                                                            
                    </Form.Select> 
                </td>                
                <td style={{textAlign:'center'}}>
                    <Button className='btn-save-monitoris' onClick={()=>{clearSelected(row.ticketId);}}>Cancelar</Button>
                    <Button className='btn-save-monitoris' onClick={()=>{asignTiciket(row.ticketId);}}>Guardar</Button>
                </td>
            </tr>                                    
            <tr>
                <td  style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
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



