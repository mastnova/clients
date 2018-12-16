import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.scss';

import { PAGE_URL } from './constants';
import Index from './components/Index/Index';
import Login from './components/Login/Login';
import Root from './components/Root/Root';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="wtf">
          <Route path={PAGE_URL.index} exact component={Index} />
          <Route path={PAGE_URL.login} exact component={Login} />
          <Route path={PAGE_URL.root} exact component={Root} />
        </div>
      </Router>
    );
  }
}

export default App;
