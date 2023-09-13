import React, { useEffect } from "react"
import { Navbar, Nav, Container, Row, Col, NavDropdown } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import { API_BASE_URL } from '../constants.js';

function handleError(e) {
    if(axios.isCancel(e))
        console.log(e.message);
}

export default function NavigationBar(props) {
    const CancelToken = axios.CancelToken
    const cancelTokenSource = CancelToken.source()

    const [username, setUsername] = React.useState("");
    const [useremail, setUseremail] = React.useState("");
    const [role, setRole] = React.useState(0);

    const cookies = new Cookies();

    const logout = () => {
        cookies.remove("USER_TOKEN", {path: "/"});
        window.location.href = "/";
    }

    useEffect(() => {
        axios.get(`${API_BASE_URL}/users/user/${cookies.get("USER_TOKEN")}`)
        .then((res) => {
            setUseremail(res.data["EMAIL"]);
            setUsername(res.data["FULLNAME"]);
            setRole(res.data["ROLEID"]);
        })
        .catch((err) => handleError(err));
    }, []);

    return (
        <Navbar className="bg-body-tertiary" expand="lg" >
            <Container id="navContainer">
                <Navbar.Brand><img id="logoImg" alt="Ltp global software" src="/images/logo.png"/></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="" onClick={() => {
                        axios.post(`${API_BASE_URL}/users/user/getViews`, {
                            role: role
                        })
                        .then((res) => {
                            window.location.href = res.data[0]["path"];
                            cancelTokenSource.cancel('Operation canceled')
                        });
                    }}>Home</Nav.Link>
                    {
                        (role == 1) ? <Nav.Link href="/users" onClick={() => {cancelTokenSource.cancel('Operation canceled')}}>Usuarios</Nav.Link> : <></>
                    }
                </Nav>
                <div>
                    <Row>
                        <Col>
                        <img src='/images/user.png' style={{width:'2.5rem', height:'2.5rem'}}></img>
                        </Col>
                        <Col>
                            <NavDropdown title={username} id="basic-nav-dropdown" style={{textAlign:'right', fontWeight:'bold'}} drop='down-centered'>
                                <NavDropdown.Item onClick={() => { cancelTokenSource.cancel('Operation canceled'); logout();}}>Cerrar sesi&oacute;n</NavDropdown.Item>                            
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
    )
}