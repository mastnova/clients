import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import './IndexOperator.scss';

import Input from '../UI/Input/Input';
import MenuOperator from '../MenuOperator/MenuOperator';
import { PAGE_URL } from '../../constants';
import API from '../../API';

class IndexOperator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      promoName: '',
      promoId: '',
      club: {
        name: 'Клуб',
        promotions: [],
        status: '',
      },
      name: '',
      nameIsValid: '',
      phone: '',
      phoneIsValid: '',
    };
  }

  componentWillMount() {
    if (!this.props.hasAuth) {
      this.props.history.push(PAGE_URL.login)
    } else {
      this.fetchClub();
    }
  }

  onChangeInput = ({ name, value, isValid }) => {
    this.setState({
      [name]: value,
      [`${name}IsValid`]: isValid,
    });
  }

  fetchClub = async () => {
    const id = this.props.club;
    const club = await API.getClub(id);
    if (club) {
      this.setState({ club });
    }
  }

  onPromoSelect = ({target}) => {
    this.setState({
      promoId: target.value,
      promoName: target.options[target.selectedIndex].text,
    })
  }

  isFormValid = () => {
    return this.state.nameIsValid && this.state.phoneIsValid;
  }

  onSubmit = async () => {
    const isExist = await API.clientIsExist({ phone: this.state.phone });
    if (isExist) {
      this.register();
    } else {
      this.sendCode();
    }
    
  }

  sendCode = () => {
    this.props.openPopup('sms-confirm', { phone: this.state.phone, callback: this.register });
  }

  register = async (code) => {
    const response = await API.createClient({
      name: this.state.name,
      phone: this.state.phone,
      promotion: {
        id: this.state.promoId,
        name: this.state.promoName,
      },
      code,
    });
    if (response.isOk) {
      this.props.openPopup('alert', { type: 'success', text: `Клиент <b>${this.state.name}</b> успешно добавлен` });
    } else {
      let text = 'Произошла ошибка';
      if (response.data.code === 7) {
        text = 'Такой клиент уже зарегистрирован';
      } else if (response.data.code === 8) {
        text = 'Клиент уже участвует в акции';
      }
      this.props.openPopup('alert', { type: 'error', text });
    }
  }

  render() {
    if (!this.state.club.status) {
      return (
        <div className="page-container operator-index">
          <MenuOperator />
        </div>
      );
    }
    if (this.state.club.status === 'blocked') {
      return (
        <div className="page-container operator-index">
          <MenuOperator />
          <div className="operator-index__content">
            <div className="block-alert">Клуб заблокирован!</div>
          </div>
        </div>
      );
    }
    return (
      <div className="page-container operator-index">
        <MenuOperator />
        <div className="operator-index__content">
          <div className="pic" />
          <div className="inputs-wrapper">
            <div className="operator-index__title">Заполните данные клиента</div>
            <label className="label">
              <div>Имя</div>
              <Input
                name="name"
                icon="login"
                type="name"
                placeholder="Введите имя"
                validationType="required"
                value={this.state.name}
                onChange={this.onChangeInput}
              />
            </label>
            <label className="label">
              <div>Телефон</div>
              <Input
                name="phone"
                icon="phone"
                placeholder="Введите телефон"
                validationType="required"
                value={this.state.phone}
                onChange={this.onChangeInput}
              />
            </label>
            <label className="label">
              <div>Акция</div>
              <select onChange={this.onPromoSelect} value={this.state.promoId}>
                <option value="">без акции</option>
                {
                  this.state.club.promotions.map( promo => <option key={promo.id} value={promo.id}>{promo.name}</option>)
                }
              </select>
            </label>
            <button className="button" onClick={this.onSubmit} disabled={!this.isFormValid()}>Отправить</button>
          </div>
        </div>
      </div>
    );
  }
}

export default IndexOperator;