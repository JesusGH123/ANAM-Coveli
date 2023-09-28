import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const ReportClient = (props) => {        

    const stylesTable = StyleSheet.create({
        page: {margin:0},
        section: { color: 'black', textAlign: 'center', paddingTop:'10px',fontSize:'11px'},    
        imgBackground: { position: 'absolute', marginTop:45, marginLeft:230, display: 'block', width: '150px', height: '70px'},
        imgBackgroundWaterMark: { position: 'absolute', marginTop:120,marginLeft:50, display: 'block', width: '500px',  opacity:0.1},
        tableContainer: { margin: '30px 40px 0 40px',flexDirection: 'row',flexWrap: 'wrap',borderWidth: 0.5,borderColor:'gray'},
        tableHeader: {flexDirection: 'row',alignItems: 'center', textAlign: 'center',flexGrow: 1},    
        row: {textAlign:'left',flexDirection: 'row', alignItems: 'center', fontStyle: 'bold'},
        separatorTop: {width: '100%', height: '10px', fontSize:'10px', fontFamily:'Helvetica-Bold'},
        separatorBottom: {width: '100%', height: '18px', fontSize:'10px', fontFamily:'Helvetica-Bold'},
        titleReport: {width: '100%', height: '18px', fontSize:'10px', paddingTop:'4px', fontFamily:'Helvetica-Bold'},
        noTicket: { width: '11%', height: '14px', fontSize:'6px', paddingTop:'4px', paddingLeft:'4px'},
        noTicketValue: { width: '69%', height: '14px', fontSize:'6px', paddingTop:'4px', paddingLeft:'4px', textDecoration:'underline'},
        fechaHora: { width: '5%', height: '14px', fontSize:'6px', paddingTop:'4px', paddingRight:'4px', textAlign:'right'},
        fechaHoraValue: {width: '15%', height: '14px',fontSize:'6px', paddingTop:'4px', textDecoration:'underline'},
        titleGroup: {width: '100%', fontSize:'8px', padding:0, margin:0, fontFamily:'Helvetica-Bold', borderBottom:0.5, borderTop:0.5, borderColor:'gray', backgroundColor:'#E7EAEF'},
        titleGroupNoBorder: {width: '100%', fontSize:'8px', padding:0, margin:0, fontFamily:'Helvetica-Bold'},
        datosText: { width: '15%', height: '14px', fontSize:'6px', paddingTop:'4px', paddingLeft:'4px'},
        datosValue: { width: '34%', height: '14px', fontSize:'6px', paddingTop:'4px', paddingLeft:'4px', borderBottom:0.5},
        datosSpace:{width:'2%'},
        atencionText: { width: '25%', height: '14px', fontSize:'6px', paddingTop:'4px',paddingLeft:'4px'},
        atencionHours: {height: '14px', fontSize:'6px', paddingTop:'4px', paddingLeft:'4px'},
        atencionValue: { width: '24%', height: '14px', fontSize:'6px', paddingTop:'4px', paddingLeft:'4px', borderBottom:0.5},
        check: { width: '20px', height: '12px', fontSize:'6px', textAlign:'center', border:0.5, borderRadius:"2px", paddingTop:'2px'},
        incidenteText: { width: '100%', height: '14px', fontSize:'6px', paddingTop:'4px', paddingLeft:'4px'},
        incidenteValue: { width: '100%', height: '100px', border:1, borderRadius:"10px", margin: '4px 2% 10px 2%', paddingTop:"5px", paddingLeft:"5px", fontSize:"6px"},
        evidenciaValue: { width: '50%', height: '200px', border:1, borderRadius:"10px", margin: '4px 2% 10px 2%', alignItems:'center', textAlign:'center', paddingTop:'30px'},        
        pagina: {width: '100%', fontSize:'8px', padding:0, margin:0, textAlign:'right', paddingRight:'4px'},
        visitaText: { width: '15%', height: '14px', fontSize:'6px', paddingTop:'4px', paddingLeft:'4px' },
        visitaValue: { width: '35%', height: '14px', fontSize:'6px', paddingTop:'4px', paddingLeft:'4px', borderBottom:0.5},
        iniReport: { width: '33.3%', height: '18px', fontSize:'10px', borderRight:0.5, borderTop:0.5, paddingTop:'4px', borderColor:'gray', backgroundColor:'#E7EAEF' },
        titleEvidencia: {width: '50%', height: '18px', fontSize:'10px', textAlign:'center'},
        statusEquipmentText:{width:'15%', height: '14px', fontSize:'6px', paddingTop:'4px', paddingLeft:'4px'},
        statusEquipmentValue:{width:'25%', height: '14px', fontSize:'6px', paddingTop:'4px',paddingLeft:'4px', border:0.5},
        aceptationTitleLeft: {width: '50%', height: '10px', fontSize:'6px', textAlign:'center', borderBottom:0.5, borderRight:0.5, paddingTop:'2px'},
        aceptationTitleRight: {width: '50%', height: '10px', fontSize:'6px', textAlign:'center', borderBottom:0.5, paddingTop:'2px'},
        aceptationTextLeft: {width: '7%', height: '10px', fontSize:'6px', borderBottom:0.5, borderRight:0.5, paddingTop:'2px', paddingLeft:'4px'},
        aceptationValueLeft: {width: '43%', height: '10px', fontSize:'6px', borderBottom:0.5, borderRight:0.5, paddingTop:'2px', paddingLeft:'4px'},    
        aceptationValueRight: {width: '43%', height: '10px', fontSize:'6px', paddingTop:'2px', borderBottom:0.5, paddingLeft:'4px'},
        aceptationTextLeftSignature: {width: '7%', height: '30px', fontSize:'6px', borderBottom:0.5, borderRight:0.5, paddingTop:'2px', paddingLeft:'4px'},
        aceptationValueLeftSignature: {width: '43%', height: '30px', fontSize:'6px', borderBottom:0.5, borderRight:0.5, paddingTop:'2px', paddingLeft:'4px'},    
        aceptationValueRightSignature: {width: '43%', height: '30px', fontSize:'6px', paddingTop:'2px', borderBottom:0.5, paddingLeft:'4px'}
    
    });
    

    return(
    <Document>
        <Page size="LETTER" style={stylesTable.page} >                        
            <View style={stylesTable.section}>                            
                <Image src='/images/logo.png' style={stylesTable.imgBackground}>                                                                
                </Image>                                                            
                <Image src='/images/logo_back.png' style={stylesTable.imgBackgroundWaterMark}>                                                                
                </Image>                                                            
                <View style={stylesTable.tableContainer}>                    
                    <View style={stylesTable.tableHeader}>
                        <Text style={stylesTable.titleReport}>Reporte de mantenimiento correctivo</Text>                    
                    </View>
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.noTicket}>Numero de Ticket:</Text>
                        <Text style={stylesTable.noTicketValue}>{props.data["reporte_mantenimiento"][0]["noTicket"]}</Text>
                        <Text style={stylesTable.fechaHora}>Fecha: </Text>                
                        <Text style={stylesTable.fechaHoraValue}>{props.data["reporte_mantenimiento"][0]["fecha"]}</Text>                                                                
                    </View>
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.noTicket}>No. de contrato:</Text>
                        <Text style={stylesTable.noTicketValue}>ANAM/UAF/DRMSG/AD/013/2022</Text>
                        <Text style={stylesTable.fechaHora}>Hora: </Text>                
                        <Text style={stylesTable.fechaHoraValue}>{props.data["reporte_mantenimiento"][0]["hora"]}</Text>                                      
                    </View>
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.noTicket}>Proyecto:</Text>
                        <Text style={stylesTable.noTicketValue}>Servicio de Equipamiento Aeroportuario</Text>
                        <Text style={stylesTable.fechaHora}></Text>                
                        <Text style={stylesTable.fechaHoraValue}></Text>                                      
                    </View>                    
                    <View style={stylesTable.tableHeader}>
                        <Text style={stylesTable.titleGroup}>Datos del equipo</Text>                    
                    </View>
                    <Text style={stylesTable.separatorTop}></Text>                    
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.datosText}>Falla reportada:</Text>
                        <Text style={stylesTable.datosValue}>{props.data["reporte_mantenimiento"][0]["fallReportada"]}</Text>
                        <Text style={stylesTable.datosSpace}></Text>
                        <Text style={stylesTable.datosText}>Ubicación del equipo:</Text>                
                        <Text style={stylesTable.datosValue}>{props.data["reporte_mantenimiento"][0]["ubicacion"]}</Text>
                    </View>
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.datosText}>Equipo:</Text>
                        <Text style={stylesTable.datosValue}>{props.data["reporte_mantenimiento"][0]["equipo"]}</Text>
                        <Text style={stylesTable.datosSpace}></Text>
                        <Text style={stylesTable.datosText}>No. de serie:</Text>                
                        <Text style={stylesTable.datosValue}>{props.data["reporte_mantenimiento"][0]["noSerie"]}</Text>
                    </View>                
                    <Text style={stylesTable.separatorBottom}></Text>                    
                    <View style={stylesTable.tableHeader}>
                        <Text style={stylesTable.titleGroup}>Atención de ticket</Text>                    
                    </View>
                    <Text style={stylesTable.separatorTop}></Text>                    
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.atencionText}>Fecha / Hora de la recepción del correo:</Text>
                        <Text style={stylesTable.atencionValue}>{props.data["reporte_mantenimiento"][0]["fechaRecepcion"]}</Text>
                        <Text style={stylesTable.datosSpace}></Text>
                        <Text style={stylesTable.datosText}>Nombre del técnico:</Text>                
                        <Text style={stylesTable.datosValue}>{props.data["reporte_mantenimiento"][0]["fullName"]}</Text>             
                    </View>
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.atencionHours}>¿Se asignó conforme al SLA?:  si </Text>
                        <Text style={stylesTable.check}>{props.data["reporte_mantenimiento"][0]["asignedOnTime"] == 1 ? <Image src='/images/check.png' style={{width:'8px', height:'8px'}}></Image> : ""} </Text>
                        <Text style={stylesTable.atencionHours}> no </Text>
                        <Text style={stylesTable.check}>{props.data["reporte_mantenimiento"][0]["asignedOnTime"] == 0 ? <Image src='/images/check.png' style={{width:'8px', height:'8px'}}></Image> : ""}</Text>                    
                    </View>                                
                    <Text style={stylesTable.separatorBottom}></Text>                                    
                    <View style={stylesTable.tableHeader}>
                        <Text style={stylesTable.titleGroup}>{props.data["reporte_mantenimiento"][0]["titleFalla"]}</Text>                    
                    </View>                    
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.incidenteText}>Causa del problema:</Text>                                        
                    </View>                
                    
                    <View style={stylesTable.row}>
                    <Text style={stylesTable.incidenteValue}>{props.data["reporte_mantenimiento"][0]["causaProblema"]}</Text>
                    </View>
                    <Text style={stylesTable.titleReport}></Text>                    
                    <View style={stylesTable.tableHeader}>
                        <Text style={stylesTable.titleGroupNoBorder}>Evidencia del equipo reportado</Text>                    
                    </View>                
                    <Text style={stylesTable.titleReport}></Text>                                    
                    <View style={stylesTable.row}>                        
                        <Text style={stylesTable.evidenciaValue}>{props.data["reporte_mantenimiento"][0]["evidenciaCliente1"] != "" ? <Image style={{width:'200px', height:'150px'}} src={props.data["reporte_mantenimiento"][0]["evidenciaCliente1"]}></Image> :""}</Text>
                        <Text style={stylesTable.evidenciaValue}>{props.data["reporte_mantenimiento"][0]["evidenciaCliente2"] != "" ? <Image style={{width:'200px', height:'150px'}} src={props.data["reporte_mantenimiento"][0]["evidenciaCliente2"]}></Image> :""}</Text>
                    </View>
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.titleEvidencia}>Evidencia 1</Text>
                        <Text style={stylesTable.titleEvidencia}>Evidencia 2</Text>
                    </View>  
                    <Text style={stylesTable.separatorBottom}></Text>                    
                    <Text style={stylesTable.separatorBottom}></Text>                    
                    <Text style={stylesTable.separatorBottom}></Text>                                   
                    <Text style={stylesTable.separatorBottom}></Text>
                    <View>
                        <Text style={stylesTable.pagina}>Página 1 de 2</Text>
                    </View>                
                </View>
            </View>
        </Page>
        <Page size="LETTER" style={stylesTable.page} >                        
            <View style={stylesTable.section}>                            
                <Image src='/images/logo.png' style={stylesTable.imgBackground}>                                                                
                </Image>                                                            
                <Image src='/images/logo_back.png' style={stylesTable.imgBackgroundWaterMark}>                                                                
                </Image>                                                            
                <View style={stylesTable.tableContainer}>
                    <View style={stylesTable.tableHeader}>
                        <Text style={stylesTable.titleReport}>Reporte de mantenimiento correctivo</Text>                    
                    </View>
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.noTicket}>Numero de Ticket:</Text>
                        <Text style={stylesTable.noTicketValue}>{props.data["reporte_mantenimiento"][0]["noTicket"]}</Text>
                        <Text style={stylesTable.fechaHora}>Fecha: </Text>                
                        <Text style={stylesTable.fechaHoraValue}>{props.data["reporte_mantenimiento"][0]["fecha"]}</Text>                                                                
                    </View>
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.noTicket}>No. de contrato:</Text>
                        <Text style={stylesTable.noTicketValue}>ANAM/UAF/DRMSG/AD/013/2022</Text>
                        <Text style={stylesTable.fechaHora}>Hora: </Text>                
                        <Text style={stylesTable.fechaHoraValue}>{props.data["reporte_mantenimiento"][0]["hora"]}</Text>                                      
                    </View>
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.noTicket}>Proyecto:</Text>
                        <Text style={stylesTable.noTicketValue}>Servicio de Equipamiento Aeroportuario</Text>
                        <Text style={stylesTable.fechaHora}></Text>                
                        <Text style={stylesTable.fechaHoraValue}></Text>                                      
                    </View>                    
                    <Text style={stylesTable.separatorBottom}></Text>                                        
                    <View style={stylesTable.tableHeader}>
                        <Text style={stylesTable.titleGroup}>Visita en sitio</Text>                    
                    </View>                                        
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.incidenteText}>Acciones correctivas:</Text>                                        
                    </View>                    
                    
                    <View style={stylesTable.row}>
                    <Text style={stylesTable.incidenteValue}>{props.data["reporte_mantenimiento"][0]["accionesCorrectivas"]}</Text>
                    </View>                    
                    <View style={stylesTable.tableHeader}>
                        <Text style={stylesTable.titleGroupNoBorder}>Evidencia del equipo reportado</Text>                    
                    </View>                                    
                    <View style={stylesTable.row}>
                    <Text style={stylesTable.evidenciaValue}>{props.data["reporte_mantenimiento"][0]["evidenciaTecnico1"] != "" ? <Image style={{ width:'200px', height:'150px'}} src={props.data["reporte_mantenimiento"][0]["evidenciaTecnico1"]}></Image> :""}</Text>
                        <Text style={stylesTable.evidenciaValue}>{props.data["reporte_mantenimiento"][0]["evidenciaTecnico2"] != "" ? <Image style={{width:'200px', height:'150px'}} src={props.data["reporte_mantenimiento"][0]["evidenciaTecnico2"]}></Image> :""}</Text>
                    </View>
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.titleEvidencia}>Evidencia 1</Text>
                        <Text style={stylesTable.titleEvidencia}>Evidencia 2</Text>
                    </View>                    
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.incidenteText}>Observaciones:</Text>                                                                
                    </View>                
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.incidenteValue}>{props.data["reporte_mantenimiento"][0]["Observaciones"]}</Text>
                    </View>
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.statusEquipmentText}>Estatus del equipo:</Text>
                        <Text style={stylesTable.statusEquipmentValue}>{props.data["reporte_mantenimiento"][0]["estatusEquipo"]}</Text>                        
                        <Text style={{width:'60%', height:'20px'}}></Text>                        
                    </View>
                    
                    <View style={stylesTable.tableHeader}>
                        <Text style={stylesTable.titleGroup}>Atención vía correo electrónico</Text>                    
                    </View>                    
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.atencionText}>Fecha y Hora de reparación:</Text>
                        <Text style={stylesTable.atencionValue}>{props.data["reporte_mantenimiento"][0]["fechaReparacion"]}</Text>
                        <Text style={{width:'61%'}}></Text>                        
                    </View>
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.atencionHours}>Tiempo de reparación:  {props.data["reporte_mantenimiento"][0]["tiempoReparacion"]} </Text>
                        <Text style={stylesTable.check}>{props.data["reporte_mantenimiento"][0]["ontime"] == 1 ? <Image src='/images/check.png' style={{width:'8px', height:'8px'}}></Image> : ""} </Text>
                        <Text style={stylesTable.atencionHours}>{props.data["reporte_mantenimiento"][0]["tiempoReparacionPasado"]}</Text>
                        <Text style={stylesTable.check}>{props.data["reporte_mantenimiento"][0]["ontime"] == 0 ? <Image src='/images/check.png' style={{width:'8px', height:'8px'}}></Image> : ""} </Text>
                    </View>
                    <View style={stylesTable.tableHeader}>
                        <Text style={stylesTable.titleGroup}>Aceptación del servicio</Text>                    
                    </View>
                    <View style={stylesTable.row}>                        
                        <Text style={stylesTable.aceptationTitleLeft}>Responsable LTP GLOBAL SOFTWARE</Text>
                        <Text style={stylesTable.aceptationTitleRight}>Responsable ADUANAS</Text>
                    </View>
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.aceptationTextLeft}>Nombre:</Text>
                        <Text style={stylesTable.aceptationValueLeft}>{props.data["reporte_mantenimiento"][0]["responsableLTP"]}</Text>
                        <Text style={stylesTable.aceptationTextLeft}>Nombre: </Text>
                        <Text style={stylesTable.aceptationValueRight}>{props.data["reporte_mantenimiento"][0]["responsableAduana"]}</Text>
                    </View>                                        
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.aceptationTextLeft}>Cargo:</Text>
                        <Text style={stylesTable.aceptationValueLeft}>{props.data["reporte_mantenimiento"][0]["cargoLTP"]}</Text>
                        <Text style={stylesTable.aceptationTextLeft}>Cargo: </Text>
                        <Text style={stylesTable.aceptationValueRight}>{props.data["reporte_mantenimiento"][0]["cargoAduana"]}</Text>
                    </View>                                        
                    <View style={stylesTable.row}>
                        <Text style={stylesTable.aceptationTextLeftSignature}>Firma:</Text>
                        <Text style={stylesTable.aceptationValueLeftSignature}></Text>
                        <Text style={stylesTable.aceptationTextLeftSignature}>Firma: </Text>
                        <Text style={stylesTable.aceptationValueRightSignature}></Text>
                    </View>                                        
                    <View>
                        <Text style={stylesTable.pagina}>Página 2 de 2</Text>
                    </View>                
                </View>
            </View>
        </Page>
    </Document>           
    )    
}

export default ReportClient;