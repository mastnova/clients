import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Input from '../../UI/Input/Input';

class EditName extends PureComponent {

  state = {
    value: '',
    isValid: true,
  }

  onChangeInput = ({value, isValid}) => {
    this.setState({ value, isValid });
  }

  onAccept = () => {
    this.props.data.callback(this.state.value);
    this.props.close();
  }

  render() {
    const { title, input } = this.props.data;
    return (
      <div className="popup-content popup_edit-name">
        <div className="popup-content__title" dangerouslySetInnerHTML={{ __html: title }} />
        <label className="label">
          <div>{input.name}</div>
          <Input
            name="input"
            icon={input.icon}
            placeholder={input.placeholder}
            validationType="required"
            defaultValue={input.value}
            value={this.state.value}
            onChange={this.onChangeInput}
          />
        </label>
        <button className="button" onClick={this.onAccept} disabled={!this.state.isValid}>Изменить</button>
      </div>
    );
  }
}

EditName.propTypes = {
  close: PropTypes.func.isRequired,
  data: PropTypes.shape({
    callback: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  })
};

export default EditName;