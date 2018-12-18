import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';

import { PAGE_URL } from './constants';
import Index from './components/Index/Index';
import Login from './components/Login/Login';
import Root from './components/Root/Root';
import Popup from './components/Popup/Popup';

class App extends Component {
  state = {
    popupIsOpen: false,
    popupName: '',
    popupData: null,
  }

  openPopup = (popupName, data) => {
    this.setState({
      popupIsOpen: true,
      popupName,
      popupData: data,
    });
  }

  closePopup = () => {
    this.setState({
      popupIsOpen: false
    });
  }

  render() {
    return (
      <Router>
        <div className="router">
          <Route path={PAGE_URL.index} exact render={(props) => <Index {...props} openPopup={this.openPopup} />} />
          <Route path={PAGE_URL.login} exact component={Login} />
          <Route path={PAGE_URL.root} exact component={Root} />
          <Popup 
            isOpen={this.state.popupIsOpen}
            name={this.state.popupName}
            data={this.state.popupData}
            open={this.openPopup}
            close={this.closePopup}
          />
        </div>
      </Router>
    );
  }
}

export default App;
