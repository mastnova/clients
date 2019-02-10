import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from '../../UI/Input/Input';

class EditPromo extends PureComponent {

  state = {
    name: this.props.data.name,
    nameIsValid: true,
  }

  onChangeInput = ({ name, value, isValid }) => {
    this.setState({
      [name]: value,
      [`${name}IsValid`]: isValid,
    });
  }

  isFormValid = () => {
    return this.state.nameIsValid;
  }

  onAccept = () => {
    this.props.data.callback(this.state.name, this.area.value);
    this.props.close();
  }

  render() {
    const { name, description } = this.props.data;
    return (
      <div className="popup-content popup_edit-promo">
        <div className="popup-content__title">Редактировать акцию</div>
        <label className="label">
          <div>Название</div>
          <Input
            name="name"
            icon="promo"
            placeholder="Введите название"
            validationType="required"
            defaultValue={name}
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
              defaultValue={description}
              ref={el => this.area = el}
            />
          </div>
        </label>
        <button className="button" onClick={this.onAccept} disabled={!this.isFormValid()}>Изменить</button>
      </div>
    );
  }
}

EditPromo.propTypes = {
  close: PropTypes.func.isRequired,
  data: PropTypes.shape({
    callback: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  })
};

export default EditPromo;