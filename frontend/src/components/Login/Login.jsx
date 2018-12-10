import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <div>
        <p>Login Page</p>
        <input placeholder="Login" /><br />
        <input placeholder="Password" /><br />
      </div>
    );
  }
}

Login.propTypes = {
  
};

export default Login;