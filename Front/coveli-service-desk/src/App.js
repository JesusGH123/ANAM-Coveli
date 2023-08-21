import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from './Login/Login';
import Home from './Home/Home';
import ProtectedRoutes from './ProtectedRoutes';
import HomeTecnical from "./HomeTecnical/HomeTenical";

function App() {
  return (
    <div className="App">
        <Switch>
            <Route exact path="/" component={Login}/>
            <ProtectedRoutes path="/home" component={HomeTecnical}/>                        
        </Switch>
    </div>
  );
}

export default App;