import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Popup.scss';

import AddAgent from './popups/AddAgent';
import AddClub from './popups/AddClub';
import AddPromo from './popups/AddPromo';
import AddOperator from './popups/AddOperator';
import ActionConfirm from './popups/ActionConfirm';
import SmsConfirm from './popups/SmsConfirm';
import Alert from './popups/Alert';
import EditName from './popups/EditName';
import EditUser from './popups/EditUser';

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
      document.getElementsByTagName('html')[0].style.overflow = 'auto';
    } else {
      document.addEventListener('keydown', this.onPressEsc);
      document.getElementsByTagName('html')[0].style.overflow = 'hidden';
    }

    let content;
    const props = {
      data: this.props.data,
      openPopup: this.props.open,
      close: this.props.close,
    }
    if (this.props.name === 'add-agent') {
      content = <AddAgent {...props}/>
    } else if (this.props.name === 'alert') {
      content = <Alert {...props}/>
    } else if (this.props.name === 'add-club') {
      content = <AddClub {...props}/>
    } else if(this.props.name === 'add-promo') {
      content = <AddPromo {...props}/>
    } else if (this.props.name === 'add-operator') {
      content = <AddOperator {...props}/>
    } else if (this.props.name === 'action-confirm') {
      content = <ActionConfirm {...props}/>
    } else if (this.props.name === 'sms-confirm') {
      content = <SmsConfirm {...props}/>
    } else if (this.props.name === 'edit-name') {
      content = <EditName {...props}/>
    } else if (this.props.name === 'edit-user') {
      content = <EditUser {...props}/>
    }

    const cantClose = this.props.name === 'alert' || this.props.name === 'sms-confirm';
    return (
      <ReactCSSTransitionGroup
        transitionName="showpopup"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={150}>
        {
          this.props.isOpen && 
          <div className="popup-wrapper" onClick={cantClose ? null : this.props.close}>
            <div className="popup-block">
              <div className="content-wrapper" onClick={this.preventClosing}>
                {!cantClose && <div className="close-btn" onClick={this.props.close} />}
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