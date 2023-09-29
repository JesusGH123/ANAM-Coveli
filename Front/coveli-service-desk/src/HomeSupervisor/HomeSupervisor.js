import React, { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table, Container, Row, Col, Modal, InputGroup, Form, Carousel } from "react-bootstrap";
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import Cookies from "universal-cookie";
import './HomeSupervisor.css';
import { API_BASE_URL, APP_REFRESHING_TIME } from '../constants.js';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableContainer from  '@mui/material/TableContainer';
import { Paper } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ReportSumary from'../Reports/ReportMaintenanceSummary.js';
import Report from'../Reports/ReportMaintenance.js';
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
import { styled } from '@mui/system';
import {
  TablePagination,
  tablePaginationClasses as classes,
} from '@mui/base/TablePagination';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const cookies = new Cookies();
let CancelToken = axios.CancelToken;
let cancelTokenSource = CancelToken.source();

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

export default function HomeSupervisor() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);    
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

        const fetchData = async () => {
            if(cookies.get("USER_TOKEN")) {
                axios.get(`${API_BASE_URL}/home/getSupervisorHome/${cookies.get("USER_TOKEN")}`, { cancelToken: cancelTokenSource.token })
                    .then((res) => {
                        setInfo(res.data);
                    })
                    .catch((err) => handleError(err));
                }
        }
        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, APP_REFRESHING_TIME);
        return () => clearInterval(intervalId);
    }, [])

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
        maintainAspectRatio : false,
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
        maintainAspectRatio : false,
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
        handleCloseReport();   
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - info["tickets"]["first_section"].length) : 0;   
    const emptyRowsHistory = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - info["tickets"]["second_section"].length) : 0;   

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                    <Col md={6} lg={6} xs={12}>
                        <Line options={weekly} data={weeklyData} />
                    </Col>
                    <Col md={6} lg={6} xs={12}>
                        <Line options={monthly} data={monthlyData} />
                    </Col>
                </Row>
    
                <Row className="graphicsArea">
                <TableContainer component={Paper}>
                    <Box sx={{ margin: 1 }}>
                    <Typography variant="h4" gutterBottom component="div">
                    Tickets
                    </Typography>
                    <Table striped bordered hover responsive aria-label='custom pagination table'>
                        <thead>
                            <tr>
                                <th style={{width:"3rem"}}>Id</th>
                                <th>Ubicación</th>
                                <th>Equipo</th>
                                <th>Serie</th>
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
                            {(rowsPerPage > 0 ? info["tickets"]["first_section"].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage):                               
                            info["tickets"]["first_section"]).map((row) => (<RowTicket key={row.ticketId} row={row} />))
                            }  
                            {emptyRows > 0 && (
                                <tr style={{ height: 34 * emptyRows }}>
                                <td colSpan={11} aria-hidden />
                                </tr>
                            )}                                                                                                                  
                        </tbody>
                        <tfoot>
                            <tr>
                                <CustomTablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                                colSpan={10}
                                count={info["tickets"]["first_section"].length}
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
    
                <Row className="graphicsArea">
                <TableContainer component={Paper}>
                    <Box sx={{ margin: 1 }}>
                    <Typography variant="h4" gutterBottom component="div">
                    Historial
                    </Typography>
                    <Table striped bordered hover responsive aria-label='custom pagination table'>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Ubicación</th>
                                <th>Equipo</th>
                                <th>Serie</th>
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
                            {(rowsPerPage > 0 ? info["tickets"]["second_section"].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage):                               
                            info["tickets"]["second_section"]).map((row) => (<RowTicketHistory key={row.ticketId} row={row} />))
                            }  
                            {emptyRowsHistory > 0 && (
                                <tr style={{ height: 34 * emptyRowsHistory }}>
                                <td colSpan={11} aria-hidden />
                                </tr>
                            )}                                                                                                                                              
                        </tbody>
                        <tfoot>
                            <tr>
                                <CustomTablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                                colSpan={10}
                                count={info["tickets"]["second_section"].length}
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
        </Container>
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
                <td component="th" scope='row' style={{width:'5rem'}}>                                   
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
                <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
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
    
    const generatePdfDocument = (ticketId) => {        
        axios.get(`${API_BASE_URL}/home/getMaintenanceReport/${ticketId}`)
        .then(async(res) => {            
            const blob = await pdf((
                <Report data={res.data} />
            )).toBlob();
            saveAs(blob, "reporte_ticket("+ticketId+").pdf");                            
        });        
    };      
        
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
            <tr  sx={{ '& > *': { borderBottom: 'unset' } }} >
                <td component="th" scope='row' style={{color: row.onTime == 0 ?'red': row.onTime == 1 ?'green' : 'black'}}>                                   
                    <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() =>{setOpen(!open); getTicketHistory(row.ticketId);}}                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}                            
                    </IconButton>                             
                    {row.ticketId}
                </td>                
                <td style={{color: row.onTime == 0 ?'red': row.onTime == 1 ?'green' : 'black'}}>{row.equipmentLocation}</td>
                <td style={{color: row.onTime == 0 ?'red': row.onTime == 1 ?'green' : 'black'}}>{row.equipmentModel}</td>
                <td style={{color: row.onTime == 0 ?'red': row.onTime == 1 ?'green' : 'black'}}>{row.equipmentSerial}</td>            
                <td style={{color: row.onTime == 0 ?'red': row.onTime == 1 ?'green' : 'black'}}>{row.category}</td>
                <td style={{color: row.onTime == 0 ?'red': row.onTime == 1 ?'green' : 'black'}}>{row.client}</td>
                <td style={{color: row.onTime == 0 ?'red': row.onTime == 1 ?'green' : 'black'}}>{row.openDate}</td>
                <td style={{color: row.onTime == 0 ?'red': row.onTime == 1 ?'green' : 'black'}}>{row.priority}</td>
                <td style={{color: row.onTime == 0 ?'red': row.onTime == 1 ?'green' : 'black'}}>{row.situation}</td>
                <td style={{color: row.onTime == 0 ?'red': row.onTime == 1 ?'green' : 'black'}}>{row.technical}</td>
                <td style={{color: row.onTime == 0 ?'red': row.onTime == 1 ?'green' : 'black'}}>{row.statusid == 9 ? <Button variant='success'style={{borderRadius:'3rem'}} onClick={()=>{generatePdfDocument(row.ticketId)}}>Generar Reporte</Button> : row.status}</td>
            </tr>                                    
            <tr>
                <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
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





