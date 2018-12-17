import React, { PureComponent } from 'react';
import Input from '../../UI/Input/Input';

class AddAgent extends PureComponent {
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

  addAgent = (e) => {
    e.preventDefault();
    console.log('added')
    // const res = await API.login({
    //   login: this.state.login,
    //   password: this.state.password,
    // });
  }

  render() {
    return (
      <div className="popup-content popup_add-agent">
        <div className="popup-content__title">Добавить агента</div>
        <form onSubmit={this.addAgent}>
          <label>
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
          <label>
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
          <label>
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

export default AddAgent;