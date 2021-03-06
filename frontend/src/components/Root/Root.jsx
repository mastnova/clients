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
    const response = await API.createUser({
      role: 'root',
      login: this.state.login,
      password: this.state.password,
    });
    if (response.isOk) {
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
                  icon="login"
                  placeholder="Логин"
                  validationType="required"
                  value={this.state.login}
                  onChange={this.onChangeInput}
                />
              </label>
              <label>
                <div>Пароль</div>
                <Input
                  type="password"
                  icon="password"
                  name="password"
                  placeholder="Пароль"
                  validationType="required"
                  value={this.state.password}
                  onChange={this.onChangeInput}
                />
              </label>
              <label>
                <div>Повтор пароля</div>
                <Input
                  type="password"
                  icon="password"
                  name="repeatPassword"
                  placeholder="Пароль"
                  validationType="required"
                  value={this.state.repeatPassword}
                  compareWith={this.state.password}
                  onChange={this.onChangeInput}
                />
              </label>
              <button className="button" type="submit" disabled={!this.isFormValid()}>Создать</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Root;