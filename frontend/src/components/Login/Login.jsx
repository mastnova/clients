import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './Login.scss';

import Input from '../UI/Input';
import API from '../../API'; 
import { PAGE_URL } from '../../constants';

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      loginIsValid: false,
      password: '',
      passwordIsValid: false,
    };
  }

  componentWillMount() {
    const hasAuth = sessionStorage.getItem('userHasAuth');
    if (hasAuth) {
      this.props.history.push(PAGE_URL.index);
    }
  }

  onChangeInput = ({ name, value, isValid }) => {
    this.setState({
      [name]: value,
      [`${name}IsValid`]: isValid,
    });
  }

  isFormValid = () => {
    return this.state.loginIsValid && this.state.passwordIsValid;
  }

  login = async () => {
    const hasAuth = await API.login({
      login: this.state.login,
      password: this.state.password,
    });
    if (hasAuth) {
      this.props.history.push(PAGE_URL.index);
    }
  }

  render() {
    return (
      <div className="login-page">
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
        <button onClick={this.login} disabled={!this.isFormValid()}>login</button>
      </div>
    );
  }
}

Login.propTypes = {
  
};

export default Login;