import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from './Login/Login';
import HomeSupervisor from "./HomeSupervisor/HomeSupervisor";
import ProtectedRoutes from './ProtectedRoutes';
import HomeTecnical from "./HomeTecnical/HomeTenical";
import HomeClient from  "./HomeClient/HomeClient"
import HomeAdmin from "./HomeAdmin/HomeAdmin";

import UsersView from "./UsersView/UsersView";

function App() {
  return (
    <div className="App">
        <Switch>
            <Route exact path="/" component={Login}/>
            <ProtectedRoutes path="/homeT" component={HomeTecnical}/>                        
            <ProtectedRoutes path="/homeS" component={HomeSupervisor}/>
            <ProtectedRoutes path="/homeC" component={HomeClient}/>
            <ProtectedRoutes path="/homeA" component={HomeAdmin}/>

            <ProtectedRoutes path="/users" component={UsersView}/>
        </Switch>
    </div>
  );
}

export default App;