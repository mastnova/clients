import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';

import Index from './components/Index/Index';
import Login from './components/Login/Login';
import Root from './components/Root/Root';


class App extends Component {
  state = {
    msg: ''
  }
  onLogin = () => {
    this.callApi()
      .then(res => this.setState({ msg: res.message }))
      .catch(err => console.log(err));
  }
  callApi = async () => {
    const response = await fetch('/api/login');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }
  render() {
    return (
      <Router>
        <div className="wtf">
          <a
            className="App-link"
            href="#"
            onClick={this.onLogin}
          >boom</a>
        <Route path="/" exact component={Index} />
        <Route path="/login" exact component={Login} />
        <Route path="/root" exact component={Root} />
        </div>
      {/* <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <input placeholder="Login"/><br/>
          <input placeholder="Password"/><br/>
          <p style={{color: 'red'}}>{this.state.msg}</p>
          <a
            className="App-link"
            href="#"
            onClick={this.onLogin}
          >
            Login
          </a>
        </header>
      </div> */}
      </Router>
    );
  }
}

export default App;
