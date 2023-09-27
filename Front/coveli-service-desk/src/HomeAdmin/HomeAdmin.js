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
import { styled } from '@mui/system';
import {
  TablePagination,
  tablePaginationClasses as classes,
} from '@mui/base/TablePagination';


const cookies = new Cookies();
let CancelToken = axios.CancelToken;
let cancelTokenSource = CancelToken.source();

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

export default function HomeAdmin(){

    const CancelToken = axios.CancelToken;
    const cancelTokenSource = CancelToken.source();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - info["all_tickets"].length) : 0;    

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                        <Table striped bordered hover responsive aria-label='custom pagination table'>
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
                            {(rowsPerPage > 0 ?info["all_tickets"].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage):                               
                            info["all_tickets"]).map((row) => (<RowTicket key={row.ticketId} row={row} />))
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
                                count={info["all_tickets"].length}
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
                    </Col>
                </Row>            
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

