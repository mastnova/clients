import React, { PureComponent } from 'react';
import classNames from 'classnames';
import './Login.scss';

import Input from '../UI/Input/Input';
import API from '../../API'; 
import { PAGE_URL } from '../../constants';
import { setPageTitle } from '../../utils/url';

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      loginIsValid: false,
      password: '',
      passwordIsValid: false,
      errorMessage: '',
    };
  }

  componentWillMount() {
    setPageTitle();
    if (this.props.hasAuth) {
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

  login = async (e) => {
    e.preventDefault();
    const res = await API.login({
      login: this.state.login,
      password: this.state.password,
    });
    if (res.isOk) {
      this.props.onLogin(res.data);
      this.props.history.push(PAGE_URL.index);
    } else {
      let errorMessage = 'Ошибка авторизации';
      if (res.data.code === 3) {
        errorMessage = 'Неверный логин или пароль';
      } else if (res.data.code === 9) {
        errorMessage = 'Аккаунт заблокирован';
      }
      this.setState({ errorMessage });
    }
  }

  render() {
    return (
      <div className="login-page">
        <div className="login-wrapper">
          <div className="login-block">
            <form className="login-panel" onSubmit={this.login}>
              <div className="header-block">
                <div className="header-block__logo" />
                <div className="header-block__title">SlotAdmin<span>Система учета клиентов</span></div>
              </div>
              <div className="login-panel__header">Вход в систему учета клиентов</div>
              <label className="label">
                <div>Логин</div>
                <Input
                  name="login"
                  icon="login"
                  placeholder="Введите логин"
                  validationType="required"
                  value={this.state.login}
                  onChange={this.onChangeInput}
                />
              </label>
              <label className="label">
                <div>Пароль</div>
                <Input
                  name="password"
                  icon="password"
                  type="password"
                  placeholder="Введите пароль"
                  validationType="required"
                  value={this.state.password}
                  onChange={this.onChangeInput}
                />
              </label>
              <div className={classNames('login-panel__error', { 'login-panel__error_show': this.state.errorMessage})}>
                {this.state.errorMessage}
              </div>
              <button className="button" type="submit" disabled={!this.isFormValid()}>Вход</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;