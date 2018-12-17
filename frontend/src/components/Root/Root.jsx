import React, { PureComponent } from 'react';
import './Root.scss';

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

  createAccount = async (e) => {
    e.preventDefault();
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
      <div className="root-page">
        <div className="root-wrapper">
          <div className="root-block">
            <form className="root-panel" onSubmit={this.createAccount}>
              <div className="root-panel__header">Создание администратора системы</div>
              <label>
                <div>Логин</div>
                <Input
                  name="login"
                  placeholder="Логин"
                  validationType="login"
                  value={this.state.login}
                  onChange={this.onChangeInput}
                />
              </label>
              <label>
                <div>Пароль</div>
                <Input
                  type="password"
                  name="password"
                  placeholder="Пароль"
                  validationType="password"
                  value={this.state.password}
                  onChange={this.onChangeInput}
                />
              </label>
              <label>
                <div>Повтор пароля</div>
                <Input
                  type="password"
                  name="repeatPassword"
                  placeholder="Пароль"
                  validationType="password"
                  value={this.state.repeatPassword}
                  compareWith={this.state.password}
                  onChange={this.onChangeInput}
                />
              </label>
              <button className="button" type="submit" disabled={!this.isFormValid()}>create</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Root;