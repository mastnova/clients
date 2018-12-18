import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Alert extends Component {
  static defaultProps = {
    data: {
      type: 'success',
      text: 'success',
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    const {type, text} = this.props.data;
    return (
      <div className="popup-content popup_alert">
        <div className={`popup_alert__alert popup_alert__alert_${type}`}>
          <span className="popup_alert__msg" dangerouslySetInnerHTML={{__html: text}}/>
        </div>
        <button className="button" onClick={this.props.close}>Закрыть</button>
      </div>
    );
  }
}

Alert.propTypes = {
  close: PropTypes.func.isRequired,
  data: PropTypes.shape({
    type: PropTypes.oneOf(['success', 'error', 'worning']).isRequired,
    text: PropTypes.string.isRequired,
  })
};

export default Alert;