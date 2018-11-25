import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
      <div className="App">
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
      </div>
    );
  }
}

export default App;
