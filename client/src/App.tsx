import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import Home from "@/pages/Home";
import Swap from "@/pages/Swap";

const App = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/swap" component={Swap} />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
