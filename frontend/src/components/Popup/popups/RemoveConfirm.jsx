import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class RemoveConfirm extends PureComponent {

  onAccept = () => {
    this.props.data.callback();
    this.props.close();
  }

  render() {
    const { title, content } = this.props.data;
    return (
      <div className="popup-content popup_confirm">
        <div className="popup-content__title" dangerouslySetInnerHTML={{ __html: title }} />
        <div className="popup_alert__alert">
          <span className="popup_confirm__remove-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <div className="popup_confirm__buttons">
          <button className="button" onClick={this.onAccept}>Удалить</button>
          <button className="button button_gray" onClick={this.props.close}>Закрыть</button>
        </div>
      </div>
    );
  }
}

RemoveConfirm.propTypes = {
  close: PropTypes.func.isRequired,
  data: PropTypes.shape({
    callback: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  })
};

export default RemoveConfirm;