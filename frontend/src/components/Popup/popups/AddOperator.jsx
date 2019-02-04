import React, { PureComponent } from 'react';

import Input from '../../UI/Input/Input';
import API from '../../../API';

class AddOperator extends PureComponent {
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

  onChangeInput = ({ name, value, isValid }) => {
    this.setState({
      [name]: value,
      [`${name}IsValid`]: isValid,
    });
  }

  isFormValid = () => {
    return this.state.loginIsValid && this.state.passwordIsValid && this.state.repeatPasswordIsValid;
  }

  addOperator = async (e) => {
    e.preventDefault();
    const response = await API.createUser({
      role: 'operator',
      login: this.state.login,
      password: this.state.password,
      clubId: this.props.data.id,
    });
    if (response.isOk) {
      this.props.openPopup('alert', { type: 'success', text: `Оператор <b>${this.state.login}</b> успешно добавлен` });
      this.props.data.callback();
      this.props.close(1);
    } else {
      const text = response.data.code === 6 ? 'Такой логин уже зарегистрирован' : 'Произошла ошибка';
      this.props.openPopup('alert', { type: 'error', text });
    }
  }

  render() {
    return (
      <div className="popup-content popup_add-agent">
        <div className="popup-content__title">Добавить оператора</div>
        <form onSubmit={this.addOperator}>
          <label className="label">
            <div>Логин</div>
            <Input
              name="login"
              icon="login"
              placeholder="Введите логин"
              validationType="login"
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
              validationType="password"
              value={this.state.password}
              onChange={this.onChangeInput}
            />
          </label>
          <label className="label">
            <div>Повтор пароля</div>
            <Input
              name="repeatPassword"
              icon="password"
              type="password"
              placeholder="Повторите пароль"
              validationType="password"
              value={this.state.repeatPassword}
              compareWith={this.state.password}
              onChange={this.onChangeInput}
            />
          </label>
          <button className="button" type="submit" disabled={!this.isFormValid()}>
            <span className="button_add">Добавить</span>
          </button>
        </form>
      </div>
    );
  }
}

export default AddOperator;