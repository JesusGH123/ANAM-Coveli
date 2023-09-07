import React from "react";
import { Page, Text, View, Document, StyleSheet,ReactPDF, renderToFile, PDFDownloadLink, Image, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({     
    page: {margin:0},
    section: { color: 'black', textAlign: 'center', paddingTop:'80px',fontSize:'11px'},
    body_center_bold: {textAlign:'center', margin: '0 70px 15px 70px',fontSize:'11px', fontFamily:'Helvetica-Bold'},
    body_center: {textAlign:'center', margin: '0 70px 15px 70px',},
    body_justify: {textAlign:'justify', margin: '0 70px 15px 70px'},
    pageBackground: {
        position: 'absolute',
        minWidth: '100%',
        minHeight: '100%',
        margin:0,
        display: 'block',
        height: '795px',
        width: '615px',
      }
    });


const stylesTable = StyleSheet.create({
    tableContainer: {
        margin: '0 70px 0 70px',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: '18px',
        borderWidth: 0.5,
        borderColor:'gray'
    },
    tableHeader: {        
        flexDirection: 'row',
        alignItems: 'center',
        height: '18px',
        textAlign: 'center',
        fontStyle: 'bold',
        border:0,
        flexGrow: 1,
        borderColor:'gray'        
    },    
    iniReport: {
        width: '33.3%', 
        height: '18px',
        fontSize:'10px',
        borderRight:0.5,
        borderTop:0.5,
        paddingTop:'4px',
        borderColor:'gray',
        backgroundColor:'#E7EAEF'    
    },
    timeAtention: {
        width: '33.3%', 
        height: '18px',
        fontSize:'10px',
        borderTop:0.5,
        borderRight:0.5,
        paddingTop:'4px',
        borderColor:'gray',
        backgroundColor:'#E7EAEF'
    },    
    timeSolution: {
        borderTop:0.5,
        width: '33.3%', 
        height: '18px',     
        fontSize:'10px',
        paddingTop:'4px',        
        borderColor:'gray',
        backgroundColor:'#E7EAEF'
    },
    iniReportValue: {
        width: '33.3%', 
        height: '18px',
        fontSize:'10px',
        borderRight:0.5,
        borderTop:0.5,
        paddingTop:'4px',
        borderColor:'gray'

    },
    timeAtentionValue: {
        width: '33.3%', 
        height: '18px',
        fontSize:'10px',
        borderTop:0.5,
        borderRight:0.5,
        paddingTop:'4px',
        borderColor:'gray'
    },    
    timeSolutionValue: {
        borderTop:0.5,
        backgroundColor:'',
        width: '33.3%', 
        height: '18px',     
        fontSize:'10px',
        paddingTop:'4px',
        borderColor:'gray'
    },
    title: {
        width: '33.3%', 
        height: '18px',     
        fontSize:'10px',
        borderTop:0.5,
        borderRight:0.5,     
        paddingTop:'4px',     
        fontSize:'10px',
        borderColor:'gray',
        paddingLeft:"2px",
        borderColor:'gray',        
        backgroundColor:'#E7EAEF'    
    },
    value: {
        textAlign:'left',
        borderTop:0.5,
        width: '66.6%', 
        height: '18px',
        fontSize:'10px',        
        fontSize:'10px',
        borderColor:'gray',
        paddingLeft:"2px"
    },
    titleSituation: {
        textAlign:'left',
        width: '33.3%', 
        height: '60px',     
        fontSize:'10px',
        borderTop:0.5,
        borderRight:0.5,     
        paddingTop:'4px',     
        fontSize:'10px',
        borderColor:'gray',
        paddingLeft:"2px",        
        backgroundColor:'#E7EAEF'
    },
    valueSituation: {
        textAlign:'left',
        borderTop:0.5,
        width: '66.6%', 
        height: '60px',
        fontSize:'10px',        
        fontSize:'10px',
        borderColor:'gray',
        paddingLeft:"2px"  
    },
    titleDesc: {
        textAlign:'left',
        width: '33.3%', 
        height: '150px',     
        fontSize:'10px',
        borderTop:0.5,
        borderRight:0.5,     
        paddingTop:'4px',     
        fontSize:'10px',
        borderColor:'gray',
        paddingLeft:"2px",        
        backgroundColor:'#E7EAEF'
    },
    valueDesc: {
        textAlign:'left',
        borderTop:0.5,
        width: '66.6%', 
        height: '150px',
        fontSize:'10px',        
        fontSize:'10px',
        borderColor:'gray',
        paddingLeft:"2px"  
    },
    row: {
        textAlign:'left',
        flexDirection: 'row',                
        alignItems: 'center',
        fontStyle: 'bold',
    },
    evidencesLeft: {
        width: '33.3%', 
        height: '130px',
        fontSize:'10px',
        borderRight:0.5,
        borderTop:0.5,
        paddingTop:'4px',
        borderColor:'gray'        
    },
    evidencesRight: {
        width: '33.3%', 
        height: '130px',
        fontSize:'10px',        
        borderTop:0.5,
        paddingTop:'4px',
        borderColor:'gray'        
    },
    titleSolution: {
        textAlign:'left',        
        width: '25%', 
        height: '60px',     
        fontSize:'10px',
        borderTop:0.5,
        borderRight:0.5,     
        paddingTop:'30px',     
        fontSize:'10px',
        borderColor:'gray',
        paddingLeft:"2px",
        backgroundColor:'#E7EAEF'
    },
    valueSolution: {
        textAlign:'left',
        borderTop:0.5,
        width: '75%', 
        height: '60px',
        fontSize:'10px',        
        fontSize:'10px',
        borderColor:'gray',
        paddingLeft:"2px"
    }
});

const styleTableFirma = StyleSheet.create({
    tableContainer: {
        margin: '0 100px 0 100px',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: '18px',
        borderWidth: 0.5,
        borderColor:'gray'
    },
    tableHeader: {        
        flexDirection: 'row',        
        height: '12px',
        textAlign: 'center',
        fontStyle: 'bold',
        border:0,
        flexGrow: 1,
        borderColor:'gray'        
    },
    row: {
        textAlign:'left',
        flexDirection: 'row',                
        alignItems: 'center',
        fontStyle: 'bold',
    },
    titleLeft: {
        width: '50%', 
        height: '12px',
        fontSize:'10px',
        borderRight:0.5,
        borderTop:0.5,        
        borderColor:'gray',
        backgroundColor:'#E7EAEF'    
    },    
    titleRight: {
        width: '50%', 
        height: '12px',
        fontSize:'10px',        
        borderTop:0.5,        
        borderColor:'gray',
        backgroundColor:'#E7EAEF'    
    },
    valueLeft: {
        textAlign:'center',
        width: '50%', 
        height: '80px',
        fontSize:'10px',
        borderRight:0.5,
        borderTop:0.5,
        paddingTop:'60px',
        borderColor:'gray'
    },    
    valueRight: {
        textAlign:'center',
        width: '50%', 
        height: '80px',
        fontSize:'10px',        
        borderTop:0.5,
        paddingTop:'60px',
        borderColor:'gray'
    },
    empresaLeft: {
        textAlign:'center',
        width: '50%', 
        height: '15px',
        fontSize:'10px',
        borderRight:0.5,
        borderTop:0.5,
        paddingTop:'4px',
        borderColor:'gray'
    },    
    empresaRight: {
        textAlign:'center',
        width: '50%', 
        height: '15px',
        fontSize:'10px',        
        borderTop:0.5,
        paddingTop:'4px',
        borderColor:'gray'
    },   


});

const ReportClient = () => {          

    return(
    <Document>
        <Page size="LETTER" style={styles.page} >                        
        <View style={styles.section}>                            
        <Image src='/images/BackPDF.png' style={styles.pageBackground}>                                                        
        </Image>                                                
            <Text style={styles.body_center_bold}>REPORTE DE INCIDENTE PARA EQUIPOS DE RAYOS X</Text>
            <Text style={styles.body_center}>“Servicio de equipamiento Aeroportuario” No. ANAM/UAF/DRMSG/AD/013/2022</Text>
            <Text style={styles.body_justify}>En cumplimiento a las obligaciones contractuales asumidas por mi Representada, y en atención a lo estipulado en la CLÁUSULA. - OBLIGACIONES DE “EL PROVEEDOR”, del contrato antes referido, me permito remitirle el reporte consolidado de los servicios preventivos, correctivos y siniestros que se realizaron en el periodo comprendido del 01 al 30 de Septiembre del 2023.</Text>        
            <View style={stylesTable.tableContainer}>
                <View style={stylesTable.tableHeader}>
                    <Text style={stylesTable.iniReport}>Incio de Reporte</Text>
                    <Text style={stylesTable.timeAtention}>Tiempo de Atención</Text>                
                    <Text style={stylesTable.timeSolution}>Tiempo de Solución</Text>                                                                
                </View>
                <View style={stylesTable.row}>
                    <Text style={stylesTable.iniReportValue}></Text>
                    <Text style={stylesTable.timeAtentionValue}></Text>                
                    <Text style={stylesTable.timeSolutionValue}></Text>                                                                
                </View>
            </View>
            <View style={stylesTable.tableContainer}>
                <View style={stylesTable.row}>                
                    <Text style={stylesTable.title}>Estatus de Ticket:</Text>
                    <Text style={stylesTable.value}></Text>                                    
                </View>                                
                <View style={stylesTable.row}>                
                    <Text style={stylesTable.title}>Nombre del Técnico:</Text>
                    <Text style={stylesTable.value}></Text>                                    
                </View>                
            </View>
            <View style={stylesTable.tableContainer}>                
                <View style={stylesTable.row}>                
                    <Text style={stylesTable.title}>Aduana:</Text>
                    <Text style={stylesTable.value}></Text>                                    
                </View>
                <View style={stylesTable.row}>                
                    <Text style={stylesTable.title}>Ubicación del equipo:</Text>
                    <Text style={stylesTable.value}></Text>                                    
                </View>
                <View style={stylesTable.row}>                
                    <Text style={stylesTable.title}>No. de serie del equipo:</Text>
                    <Text style={stylesTable.value}></Text>                                    
                </View>
                <View style={stylesTable.row}>                
                    <Text style={stylesTable.titleSituation}>Situación:</Text>
                    <Text style={stylesTable.valueSituation}></Text>                                    
                </View>
                <View style={stylesTable.row}>                
                    <Text style={stylesTable.titleDesc}>Descripción de la falla:</Text>
                    <Text style={stylesTable.valueDesc}></Text>                                    
                </View>
                <View style={stylesTable.row}>                
                    <Text style={stylesTable.title}>Estatus operativo del equipo:</Text>
                    <Text style={stylesTable.value}></Text>                                    
                </View>
                <View style={stylesTable.row}>                
                    <Text style={stylesTable.title}>Nombre de quien reporta:</Text>
                    <Text style={stylesTable.value}></Text>                                    
                </View>

            </View>

        </View>
        </Page>
        <Page size="LETTER" style={styles.page} >                        
        <View style={styles.section}>                            
        <Image src='/images/BackPDF.png' style={styles.pageBackground}>                                                        
        </Image>                                                
            <Text style={styles.body_center_bold}>REPORTE DE INCIDENTE PARA EQUIPOS DE RAYOS X</Text>
            <Text style={styles.body_center}>“Servicio de equipamiento Aeroportuario” No. ANAM/UAF/DRMSG/AD/013/2022</Text>            
            <View style={stylesTable.tableContainer}>
                <View style={stylesTable.tableHeader}>
                    <Text style={stylesTable.iniReport}>INICIO</Text>
                    <Text style={stylesTable.timeAtention}>PROCESO</Text>                
                    <Text style={stylesTable.timeSolution}>FINAL</Text>                                                                
                </View>
                <View style={stylesTable.row}>
                    <Text style={stylesTable.evidencesLeft}></Text>
                    <Text style={stylesTable.evidencesLeft}></Text>                
                    <Text style={stylesTable.evidencesRight}></Text>                                                                
                </View>
                <View style={stylesTable.row}>
                    <Text style={stylesTable.evidencesLeft}></Text>
                    <Text style={stylesTable.evidencesLeft}></Text>                
                    <Text style={stylesTable.evidencesRight}></Text>                                                                
                </View>
            </View>
            <View style={stylesTable.tableContainer}>
                <View style={stylesTable.row}>                
                    <Text style={stylesTable.titleSolution}>TRABAJO REALIZADO:</Text>
                    <Text style={stylesTable.valueSolution}></Text>                                    
                </View>                                
                <View style={stylesTable.row}>                
                    <Text style={stylesTable.titleSolution}>SOLUCIÓN Y ESTADO:</Text>
                    <Text style={stylesTable.valueSolution}></Text>                                    
                </View>                
            </View>
            <View style={styleTableFirma.tableContainer}>
                <View style={styleTableFirma.tableHeader}>
                    <Text style={styleTableFirma.titleLeft}>ENTREGADO POR:</Text>
                    <Text style={styleTableFirma.titleRight}>VALIDADO POR:</Text>
                </View>
                <View style={styleTableFirma.row}>
                    <Text style={styleTableFirma.valueLeft}>Ing. Aarón Santamaria Blanco</Text>
                    <Text style={styleTableFirma.valueRight}></Text>
                </View>
                <View style={styleTableFirma.row}>
                    <Text style={styleTableFirma.empresaLeft}>Ltp Global Software, S.A. de C.V.</Text>
                    <Text style={styleTableFirma.empresaRight}></Text>
                </View>

            </View>
        </View>
        </Page>
    </Document>           
    )
    
}

export default ReportClient;