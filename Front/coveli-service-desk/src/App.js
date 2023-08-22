import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from './Login/Login';
import HomeSupervisor from "./HomeSupervisor/HomeSupervisor";
import ProtectedRoutes from './ProtectedRoutes';
import HomeTecnical from "./HomeTecnical/HomeTenical";

function App() {
  return (
    <div className="App">
        <Switch>
            <Route exact path="/" component={Login}/>
            <ProtectedRoutes path="/homeT" component={HomeTecnical}/>                        
            <ProtectedRoutes path="/homeS" component={HomeSupervisor}/>
        </Switch>
    </div>
  );
}

export default App;