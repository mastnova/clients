import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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

  showPopup = () => {
    this.props.openPopup('add-club');
  }

  register = () => {

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
            <select>
              <option value="no">без акции</option>
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

IndexOperator.propTypes = {

};

export default IndexOperator;