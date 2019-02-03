import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from '../../UI/Input/Input';

class EditUser extends PureComponent {

  state = {
    login: '',
    loginIsValid: false,
    password: '',
    passwordIsValid: false,
    repeatPassword: '',
    repeatPasswordIsValid: false,
  };

  onChangeInput = ({ name, value, isValid }) => {
    this.setState({
      [name]: value,
      [`${name}IsValid`]: isValid,
    });
  }

  onAccept = () => {
    this.props.close();
    this.props.data.callback(this.state.login, this.state.password);
  }

  isFormValid = () => {
    return this.state.loginIsValid && this.state.passwordIsValid && this.state.repeatPasswordIsValid;
  }

  render() {
    const { title, login } = this.props.data;
    return (
      <div className="popup-content popup_edit-user">
        <div className="popup-content__title" dangerouslySetInnerHTML={{ __html: title }} />
        <label className="label">
          <div>Логин</div>
          <Input
            name="login"
            icon="login"
            placeholder="Введите логин"
            validationType="login"
            defaultValue={login}
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
        <button className="button" onClick={this.onAccept} disabled={!this.isFormValid()}>Изменить</button>
      </div>
    );
  }
}

EditUser.propTypes = {
  close: PropTypes.func.isRequired,
  data: PropTypes.shape({
    callback: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
  })
};

export default EditUser;