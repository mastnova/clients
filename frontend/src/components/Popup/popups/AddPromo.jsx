import React, { PureComponent } from 'react';

import Input from '../../UI/Input/Input';
import API from '../../../API';

class AddPromo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      nameIsValid: false,
      desc: '',
    };
  }

  onChangeInput = ({ name, value, isValid }) => {
    this.setState({
      [name]: value,
      [`${name}IsValid`]: isValid,
    });
  }

  onChangeTextarea = ({ target }) => {
    this.setState({desc: target.value});
  }

  isFormValid = () => {
    return this.state.nameIsValid;
  }

  addPromo = async (e) => {
    e.preventDefault();
    const clubId = this.props.data.id;
    const response = await API.createPromotion(clubId, {
      name: this.state.name,
      description: this.state.desc,
    });
    if (response.isOk) {
      this.props.openPopup('alert', { type: 'success', text: `Акция <b>${this.state.name}</b> успешно добавлена` });
      this.props.data.callback();
      this.props.close(1);
    } else {
      this.props.openPopup('alert', { type: 'error', text: response.data.message });
    }
  }

  render() {
    return (
      <div className="popup-content popup_add-agent">
        <div className="popup-content__title">Создать акцию</div>
        <form onSubmit={this.addPromo}>
          <label className="label">
            <div>Название</div>
            <Input
              name="name"
              icon="promo"
              placeholder="Введите название"
              validationType="required"
              value={this.state.name}
              onChange={this.onChangeInput}
            />
          </label>
          <label className="label">
            <div>Описание</div>
            <div className="textarea-icon textarea-icon__text">
              <textarea
                className="textarea"
                name="desc"
                placeholder="Введите описание"
                value={this.state.desc}
                onChange={this.onChangeTextarea}
              />
            </div>
          </label>
          <button className="button" type="submit" disabled={!this.isFormValid()}>
            <span className="button_add">Добавить</span>
          </button>
        </form>
      </div>
    );
  }
}

export default AddPromo;