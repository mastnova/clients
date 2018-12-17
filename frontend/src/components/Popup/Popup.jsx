import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Popup.scss';

import AddAgent from './popups/AddAgent';

class Popup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  preventClosing = (e) => {
    e.stopPropagation();
  }

  onPressEsc = (e) => {
    if (e.key === 'Escape') {
      this.props.close()
    }
  }

  render() {
    if (!this.props.isOpen) {
      document.removeEventListener('keydown', this.onPressEsc);
    } else {
      document.addEventListener('keydown', this.onPressEsc);
    }

    let content;
    if (this.props.name === 'add-agent') {
      content = <AddAgent />
    }

    return (
      <ReactCSSTransitionGroup
        transitionName="showpopup"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        {
          this.props.isOpen && 
          <div className="popup-wrapper" onClick={this.props.close}>
            <div className="popup-block">
              <div className="content-wrapper" onClick={this.preventClosing}>
                <div className="close-btn" onClick={this.props.close} />
                {content}
              </div>
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
      
    );
  }
}

Popup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
};

export default Popup;