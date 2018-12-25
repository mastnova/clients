import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';

import { PAGE_URL } from './constants';
import Header from './components/Header/Header';
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

class App extends Component {
  state = {
    popupIsOpen: false,
    popupName: '',
    popupData: null,
    userName: '',
    userRole: '',
    userClub: '',
    hasAuth: false,
  }

  componentWillMount() {
    const storedData = sessionStorage.getItem('user');
    if (storedData) {
      const user = JSON.parse(storedData);
      this.setState(user);
    }
  }

  saveUser = () => {
    const user = {
      userName: this.state.userName,
      userRole: this.state.userRole,
      userClub: this.state.userClub,
      hasAuth: this.state.hasAuth,
    }
    sessionStorage.setItem('user', JSON.stringify(user));
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

  onLogin = (user) => {
    this.setState({
      userName: user.login,
      userRole: user.role,
      userClub: user.clubId,
      hasAuth: true,
    }, this.saveUser);
  }

  onLogout = () => {
    this.setState({
      userName: '',
      userRole: '',
      userClub: '',
      hasAuth: false,
    }, () => {
      this.saveUser();
      document.location = PAGE_URL.login;
    });
  }

  render() {
    let specialRoutes;
    if (this.state.userRole === 'operator') {
      specialRoutes = <>
        <Route path={PAGE_URL.index} exact render={(props) => <IndexOperator {...props} openPopup={this.openPopup} hasAuth={this.state.hasAuth} club={this.state.userClub} />} />
      </>;
    } else if (this.state.userRole === 'agent') {
      specialRoutes = <>
        <Route path={PAGE_URL.index} exact render={(props) => <IndexAgent {...props} openPopup={this.openPopup} hasAuth={this.state.hasAuth} />} />
      </>;
    } else {
      specialRoutes = <>
        <Route path={PAGE_URL.index} exact render={(props) => <Index {...props} openPopup={this.openPopup}  hasAuth={this.state.hasAuth} />} />
      </>;
    }
    return (
      <Router>
        <div className="router">
          <Route path={PAGE_URL.login} children={({ match }) => match ? '' : <Header role={this.state.userRole} name={this.state.userName} onLogout={this.onLogout}/> }/>
          {specialRoutes}
          <Route path={PAGE_URL.login} exact render={(props) => <Login {...props} onLogin={this.onLogin} hasAuth={this.state.hasAuth} />} />
          <Route path={PAGE_URL.root} exact component={Root} />
          <Route path={`${PAGE_URL.clients}/:id`} exact component={Clients} />
          <Route path={`${PAGE_URL.client}/:id`} exact component={Client} />
          <Route path={`${PAGE_URL.club}/:id`} exact render={(props) => <Club {...props} openPopup={this.openPopup}/>} />
          <Route path={`${PAGE_URL.club}/:id/operators`} exact render={(props) => <Operators {...props} openPopup={this.openPopup} />} />
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
