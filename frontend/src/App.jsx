import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';

import { PAGE_URL } from './constants';
import Index from './components/Index/Index';
import IndexAgent from './components/IndexAgent/IndexAgent';
import IndexOperator from './components/IndexOperator/IndexOperator';
import Login from './components/Login/Login';
import Root from './components/Root/Root';
import Clients from './components/Clients/Clients';
import Client from './components/Client/Client';
import Club from './components/Club/Club';
import Operators from './components/Operators/Operators';
import Popup from './components/Popup/Popup';
import user from './utils/user';

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
    let specialRoutes;
    if (user.getRole() === 'operator') {
      specialRoutes = <>
        <Route path={PAGE_URL.index} exact render={(props) => <IndexOperator {...props} openPopup={this.openPopup} />} />
      </>;
    } else if (user.getRole() === 'agent') {
      specialRoutes = <>
        <Route path={PAGE_URL.index} exact render={(props) => <IndexAgent {...props} openPopup={this.openPopup} />} />
      </>;
    } else {
      specialRoutes = <>
        <Route path={PAGE_URL.index} exact render={(props) => <Index {...props} openPopup={this.openPopup} />} />
      </>;
    }
    return (
      <Router>
        <div className="router">
          {specialRoutes}
          <Route path={PAGE_URL.login} exact component={Login} />
          <Route path={PAGE_URL.root} exact component={Root} />
          <Route path={`${PAGE_URL.clients}/:id`} exact component={Clients} />
          <Route path={`${PAGE_URL.client}/:id`} exact component={Client} />
          <Route path={`${PAGE_URL.club}/:id`} exact render={(props) => <Club {...props} openPopup={this.openPopup}/>} />
          <Route path={`${PAGE_URL.club}/:id/operators`} exact component={Operators} />
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
