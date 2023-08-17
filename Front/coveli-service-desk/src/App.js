import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from './Login';
import Home from './Home';
import ProtectedRoutes from './ProtectedRoutes';

function App() {
  return (
    <div className="App">
        <Switch>
            <Route exact path="/" component={Login}/>
            <ProtectedRoutes path="/home" component={Home}/>
        </Switch>
    </div>
  );
}

export default App;