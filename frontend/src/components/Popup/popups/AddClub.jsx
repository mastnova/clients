import React, { PureComponent } from 'react';

import Input from '../../UI/Input/Input';
import API from '../../../API';

class AddClub extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      nameIsValid: false,
      address: '',
      addressIsValid: false,
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
    return this.state.nameIsValid && 
      this.state.addressIsValid && 
      this.state.loginIsValid && 
      this.state.passwordIsValid && 
      this.state.repeatPasswordIsValid;
  }

  addClub = async (e) => {
    e.preventDefault();
    const response = await API.createClub({
      name: this.state.name,
      address: this.state.address,
      login: this.state.login,
      password: this.state.password,
    });
    if (response.isOk) {
      this.props.openPopup('alert', { type: 'success', text: `Клуб <b>${this.state.name}</b> успешно создан` });
      this.props.data.callback();
      this.props.close(1);
    } else {
      const text = response.data.code === 6 ? 'Такой логин уже зарегистрирован' : 'Произошла ошибка';
      this.props.openPopup('alert', { type: 'error', text });
    }
  }

  render() {
    return (
      <div className="popup-content popup_add-club">
        <div className="popup-content__title">Создать клуб</div>
        <form onSubmit={this.addClub}>
          <label className="label">
            <div>Название клуба</div>
            <Input
              name="name"
              icon="club"
              placeholder="Введите название"
              validationType="required"
              value={this.state.name}
              onChange={this.onChangeInput}
            />
          </label>
          <label className="label">
            <div>Адрес</div>
            <Input
              name="address"
              icon="location"
              placeholder="Введите адрес"
              validationType="required"
              value={this.state.address}
              onChange={this.onChangeInput}
            />
          </label>
          <br className="stub"/>
          <br className="stub"/>
          <div className="popup-content__title">Создать оператора клуба</div>
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
            <span className="button_add">Создать</span>
          </button>
        </form>
      </div>
    );
  }
}

export default AddClub;