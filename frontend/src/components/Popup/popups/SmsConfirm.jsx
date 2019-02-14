import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class SmsConfirm extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      code: '',
    };
  }

  onAccept = () => {
    this.props.data.callback(this.state.code);
    setTimeout(() => this.props.close(1), 100);
  }

  onChangeInput = ({target}) => {
    this.setState({code: target.value});
  }

  render() {
    const { phone } = this.props.data;
    return (
      <div className="popup-content popup_confirm">
        <div className="popup-content__title">SMS отправлено</div>
        <div className="popup_confirm__content">
          Сообщение отправлено на номер
          <div className="popup_confirm__phone">{phone}</div>
          <div className="popup_confirm__code">
            <span>Код подтверждения</span>
            <input className="input" maxLength="4" value={this.state.code} onChange={this.onChangeInput} />
          </div>
        </div>
        <div className="popup_confirm__buttons">
          <button className="button" onClick={this.onAccept}>Подтвердить</button>
          <button className="button button_gray" onClick={this.props.close}>Закрыть</button>
        </div>
      </div>
    );
  }
}

SmsConfirm.propTypes = {
  close: PropTypes.func.isRequired,
  data: PropTypes.shape({
    callback: PropTypes.func.isRequired,
    phone: PropTypes.string.isRequired,
  })
};

export default SmsConfirm;