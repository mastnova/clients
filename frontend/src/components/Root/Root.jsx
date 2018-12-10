import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Input from '../UI/Input';
import API from '../../API'; 

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      loginIsValid: false,
      password: '',
      passwordIsValid: false,
      repeatPassword: '',
      repeatPasswordIsValid: false,
    };
  }

  componentWillMount() {
    this.checkIfRootExist();
  }

  checkIfRootExist = async () => {
    const response = await API.hasRoot();
    if (response.hasRoot) {
      this.props.history.push('/')
    }
  }

  onChangeInput = ({name, value, isValid}) => {
    this.setState({
      [name]: value,
      [`${name}IsValid`]: isValid,
    });
  }

  isFormValid = () => {
    return this.state.loginIsValid && this.state.passwordIsValid && this.state.repeatPasswordIsValid
  }

  createAccount = () => {
    API.createUser({login: this.state.login, password: this.state.password, role: 'root'});
  }

  render() {
    return (
      <div>
        <p>Create admin account</p>
        <Input
          name="login"
          placeholder="login"
          validationType="login"
          value={this.state.login}
          onChange={this.onChangeInput}
        />
        <br />
        <Input 
          name="password"
          placeholder="Password"
          validationType="password"
          value={this.state.password}
          onChange={this.onChangeInput}
        />
        <br />
        <Input
          name="repeatPassword"
          placeholder="Password"
          validationType="password"
          value={this.state.repeatPassword}
          compareWith={this.state.password}
          onChange={this.onChangeInput}
        />
        <br />
        <button onClick={this.createAccount} disabled={!this.isFormValid()}>create</button>
      </div>
    );
  }
}

Root.propTypes = {
  
};

export default Root;