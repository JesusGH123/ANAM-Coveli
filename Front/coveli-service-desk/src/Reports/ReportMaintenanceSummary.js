import React from "react";
import { useState, useEffect } from 'react';


import { Page, Text, View, Document, StyleSheet,ReactPDF, renderToFile, PDFDownloadLink, Image, Font } from '@react-pdf/renderer';
import { API_BASE_URL } from '../constants.js';
import axios from "axios";

let CancelToken = axios.CancelToken;
let cancelTokenSource = CancelToken.source();

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

const styleReport = StyleSheet.create({
    page: {margin:0},
    section: { color: 'black', textAlign: 'center', paddingTop:'10px',fontSize:'11px'},    
    imgBackground: { position: 'absolute', marginTop:10, marginLeft:20, display: 'block', width: '150px', height: '70px'},
    imgBackgroundWaterMark: { position: 'absolute', marginTop:80,marginLeft:160, display: 'block', width: '500px',  opacity:0.1},
    tableContainerHeader: { margin: '10px 30px 0 30px',flexDirection: 'row',flexWrap: 'wrap',borderTop: 0.5, borderRight: 0.5, borderLeft:0.5, borderColor:'gray'},    
    tableContainerBody: { margin: '0 30px 0 30px',flexDirection: 'row',flexWrap: 'wrap',border:0.5, borderColor:'gray'},    
    tableHeader: {flexDirection: 'row',alignItems: 'center', textAlign: 'center',flexGrow: 1, fontSize:'8px', width:'33.3%'},
    tableHeaderRightText: {flexDirection: 'row',alignItems: 'center', textAlign: 'left',flexGrow: 1, fontSize:'8px', width:'10%'},
    tableHeaderRightValue: {flexDirection: 'row',alignItems: 'center', textAlign: 'left',flexGrow: 1, fontSize:'8px', width:'23.3%',textAlign:'center'},
    tableHeaderRightValueBorder: {flexDirection: 'row',alignItems: 'center', textAlign: 'left',flexGrow: 1, fontSize:'8px', width:'23.3%', borderBottom:0.5},
    titleReport: {width: '100%', height: '18px', fontSize:'10px', paddingTop:'4px', fontFamily:'Helvetica-Bold', backgroundColor:'#E7EAEF', textAlign:'center', borderBottom:0.5, borderTop:0.5},
    row: {textAlign:'left',flexDirection: 'row'},
    separatorTop: {width: '100%', height: '10px', fontSize:'10px', fontFamily:'Helvetica-Bold'},
    separatorBottom: {width: '100%', height: '18px', fontSize:'10px', fontFamily:'Helvetica-Bold'},
    titleRows:{width:'7%', fontSize:'8px', borderRight:0.5, textAlign:'center'},
    titleRowsDesc:{width:'16%', fontSize:'8px', borderRight:0.5, textAlign:'center'},
    titleRowsRight:{width:'7%', fontSize:'8px', textAlign:'center'},
    valueRows:{width:'7%', fontSize:'8px', borderRight:0.5, paddingLeft:'2px'},
    valueRowsDesc:{width:'16%', fontSize:'8px', borderRight:0.5, paddingLeft:'2px'},
    valueRowsRight:{width:'7%', fontSize:'8px', paddingLeft:'2px'},
});

const ReportMaintance = (props) => {

return(
    <Document>
        <Page size="LETTER" orientation="landscape" style={styleReport.page} >
            <View style={styleReport.section} fixed>
                <Image src='/images/logo.png' style={styleReport.imgBackground}>                                                                
                </Image>                                                            
                <Image src='/images/logo_back.png' style={styleReport.imgBackgroundWaterMark}>                                                                
                </Image>
                <View style={styleReport.tableContainerHeader}>
                    <Text style={styleReport.separatorTop}></Text>
                    <View style={styleReport.row}>
                        <Text style={styleReport.tableHeader}></Text>
                        <Text style={styleReport.tableHeader}>LTP GLOBAL SOFTWARE S.A DE C.V.</Text>
                        <Text style={styleReport.tableHeaderRightText}>No de contrato:</Text>
                        <Text style={styleReport.tableHeaderRightValue}>ANAM/UAF/DRMSG/AD/013/2022</Text>
                    </View>
                    <View style={styleReport.row}>
                        <Text style={styleReport.tableHeader}></Text>
                        <Text style={styleReport.tableHeader}>Monte everest 210, Lomas de Chapultepec,</Text>
                        <Text style={styleReport.tableHeaderRightText}></Text>                
                        <Text style={styleReport.tableHeaderRightValue}>“Servicio de equipamiento Aeroportuario”</Text>
                    </View>
                    <View style={styleReport.row}>
                        <Text style={styleReport.tableHeader}></Text>
                        <Text style={styleReport.tableHeader}>Alc. Miguel Hidalgo. Ciudad de Mexico</Text>
                        <Text style={styleReport.tableHeaderRightText}>Periodo:</Text>                
                        <Text style={styleReport.tableHeaderRightValueBorder}></Text>
                    </View>                                
                    <Text style={styleReport.separatorBottom}></Text>
                    <Text style={styleReport.titleReport}>RESUMEN DE MANTENIMIENTO CORRECTIVO DEL MES</Text>
                    <View style={styleReport.row}>
                        <Text style={styleReport.titleRows}>No. Ticket</Text>
                        <Text style={styleReport.titleRowsDesc}>Descripción Falla</Text>
                        <Text style={styleReport.titleRows}>Ubicación Aduana</Text>
                        <Text style={styleReport.titleRows}>Equipo</Text>
                        <Text style={styleReport.titleRows}>No. Serie</Text>
                        <Text style={styleReport.titleRows}>Fecha Reporte</Text>
                        <Text style={styleReport.titleRows}>Hora Reporte</Text>
                        <Text style={styleReport.titleRows}>Tiempo Asignación</Text>
                        <Text style={styleReport.titleRows}>Fecha Validación</Text>
                        <Text style={styleReport.titleRows}>Hora Validación</Text>
                        <Text style={styleReport.titleRows}>Fecha Cierre</Text>
                        <Text style={styleReport.titleRows}>Hora Cierre</Text>
                        <Text style={styleReport.titleRowsRight}>Estatus Equipo</Text>
                    </View>
                </View>            
            </View>
            <View style={styleReport.tableContainerBody}>
            {props.data["resumen_reporte_mantenimiento"]?.map((row) => (
                <View style={styleReport.row}>
                    <Text style={styleReport.valueRows}>{row["ticketId"]}</Text>
                    <Text style={styleReport.valueRowsDesc}>{row["comment"]}</Text>
                    <Text style={styleReport.valueRows}>{row["equipmentLocation"]}</Text>
                    <Text style={styleReport.valueRows}>{row["equipmentModel"]}</Text>
                    <Text style={styleReport.valueRows}>{row["equipmentSerial"]}</Text>
                    <Text style={styleReport.valueRows}>{row["openDate"]}</Text>
                    <Text style={styleReport.valueRows}>{row["openDateHour"]}</Text>
                    <Text style={styleReport.valueRows}>{row["asignedTime"]}</Text>
                    <Text style={styleReport.valueRows}>{row["openDateValidate"]}</Text>
                    <Text style={styleReport.valueRows}>{row["openDateHourValidate"]}</Text>
                    <Text style={styleReport.valueRows}>{row["openDateClose"]}</Text>
                    <Text style={styleReport.valueRows}>{row["openDateHourClose"]}</Text>
                    <Text style={styleReport.valueRowsRight}>{row["equipmentStatus"]}</Text>
                </View>
            ))}                 
            </View>            
        </Page>
    </Document>
)
}

export default ReportMaintance;