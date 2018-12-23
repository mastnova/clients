import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import './IndexOperator.scss';

import Input from '../UI/Input/Input';
import { PAGE_URL } from '../../constants';
import API from '../../API';
import user from '../../utils/user';

class IndexOperator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      promoId: '',
      club: {
        name: 'Клуб',
        promotions: [],
      },
      name: '',
      nameIsValid: '',
      phone: '',
      phoneIsValid: '',
    };
  }

  componentWillMount() {
    if (!user.hasAuth()) {
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
    const id = user.getData('clubId');
    const club = await API.getClub(id);
    if (club) {
      this.setState({ club });
    }
  }

  onPromoSelect = ({target}) => {
    this.setState({
      promoId: target.value,
      // promoName: xxx.options[xxx.selectedIndex].text,
    })
  }

  register = async () => {
    const response = await API.createClient({
      name: this.state.name,
      phone: this.state.phone,
      promotion: this.state.promoId,
    });
    if (response.isOk) {
      this.props.openPopup('alert', { type: 'success', text: `Клиент <b>${this.state.name}</b> успешно добавлен` });
    } else {
      const text = response.data.code === 6 ? 'Такой логин уже зарегистрирован' : 'Произошла ошибка';
      this.props.openPopup('alert', { type: 'error', text });
    }
  }

  render() {
    return (
      <div className="operator-index">
        <p>Index Operator page <button onClick={user.logout}>logout</button></p>
        <div className="pic" />
        <div className="inputs-wrapper">
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
        </div>
        <button className="button" onClick={this.register}>Отправить</button>
      </div>
    );
  }
}

export default IndexOperator;