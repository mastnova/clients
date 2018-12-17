import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from '../UI/Input/Input';
import API from '../../API'; 
import { PAGE_URL } from '../../constants';

class Root extends PureComponent {
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
      this.props.history.push(PAGE_URL.index);
    }
  }

  onChangeInput = ({name, value, isValid}) => {
    this.setState({
      [name]: value,
      [`${name}IsValid`]: isValid,
    });
  }

  isFormValid = () => {
    return this.state.loginIsValid && this.state.passwordIsValid && this.state.repeatPasswordIsValid;
  }

  createAccount = async () => {
    const isCreated = await API.createUser({
      role: 'root',
      login: this.state.login,
      password: this.state.password,
    });
    if (isCreated) {
      this.props.history.push(PAGE_URL.login);
    }
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