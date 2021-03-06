import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import './IndexOperator.scss';

import Input from '../UI/Input/Input';
import MenuOperator from '../MenuOperator/MenuOperator';
import { PAGE_URL } from '../../constants';
import API from '../../API';

class IndexOperator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      promoName: 'Без акции',
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

  onPromoSelect = ({value, label}) => {
    this.setState({
      promoId: value,
      promoName: label,
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
      if (response.data.status === 'promoted') {
        this.props.openPopup('alert', { type: 'success', text: `Клиент <b>${this.state.name}</b> добавлен к акции <b>${this.state.promoName}</b>` });
      } else {
        this.props.openPopup('alert', { type: 'success', text: `Клиент <b>${this.state.name}</b> успешно зарегистрирован` });
      }
      this.setState({
        promoName: 'Без акции',
        promoId: '',
        name: '',
        nameIsValid: '',
        phone: '',
        phoneIsValid: '',
      });
    } else {
      let text = 'Произошла ошибка';
      let title = 'Ошибка';
      let type = 'error';
      if (response.data.code === 7) {
        const { name, phone, created } = response.data.info;
        title = 'Клиент уже зарегистрирован';
        text = `Имя клиента - <b>${name}</b><br/>Номер телефона - <b>${phone}</b><br/>Дата регистрации - <b>${moment(created).format('DD.MM.YYYY HH:mm')}</b>`;
        type = 'info';
      } else if (response.data.code === 8) {
        const { name, date } = response.data.info;
        title = 'Клиент участвовал сегодня в этой акции';
        text = `Название акции - <b>${name}</b><br/>Дата добавления - <b>${moment(date).format('DD.MM.YYYY HH:mm')}</b>`;
        type = 'info';
      } else if (response.data.code === 2) {
        text = `Этой акции не существует`;
        type = 'error';
      } else if (response.data.code === 10) {
        text = `Неверный код подтверждения`;
        type = 'error';
      }
      this.props.openPopup('alert', { type, title, text });
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
    if (this.state.club.status !== 'active') {
      return (
        <div className="page-container operator-index">
          <MenuOperator />
          <div className="operator-index__content">
            <div className="block-alert">Клуб заблокирован!</div>
          </div>
        </div>
      );
    }

    const options = this.state.club.promotions.map(promo => ({ value: promo.id, label: promo.name }));
    options.unshift({ value: '', label: 'Без акции' });
    const selectedOption = { value: this.state.promoId, label: this.state.promoName };
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
                mask="+7 (999) 999 - 99 - 99"
                placeholder="Введите телефон"
                validationType="phone"
                value={this.state.phone}
                onChange={this.onChangeInput}
              />
            </label>
            <label className="label">
              <div>Акция</div>
              <Select
                className="select"
                classNamePrefix="select"
                isSearchable={false}
                value={selectedOption}
                onChange={this.onPromoSelect}
                options={options}
              />
            </label>
            <button className="button" onClick={this.onSubmit} disabled={!this.isFormValid()}>Отправить</button>
          </div>
        </div>
      </div>
    );
  }
}

export default IndexOperator;