import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Popup.scss';

import AddAgent from './popups/AddAgent';
import Alert from './popups/Alert';

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
      content = <AddAgent openPopup={this.props.open}/>
    } else if (this.props.name === 'alert') {
      content = <Alert data={this.props.data} close={this.props.close}/>
    }

    return (
      <ReactCSSTransitionGroup
        transitionName="showpopup"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={150}>
        {
          this.props.isOpen && 
          <div className="popup-wrapper" onClick={this.props.name === 'alert' ? null : this.props.close}>
            <div className="popup-block">
              <div className="content-wrapper" onClick={this.preventClosing}>
                { this.props.name !== 'alert' && <div className="close-btn" onClick={this.props.close} />}
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
  open: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default Popup;