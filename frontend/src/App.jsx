import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';

import { PAGE_URL } from './constants';
import Header from './components/Header/Header';
import AdminRoutes from './AdminRoutes';
import AgentRoutes from './AgentRoutes';
import IndexOperator from './components/IndexOperator/IndexOperator';
import Login from './components/Login/Login';
import Root from './components/Root/Root';
import Popup from './components/Popup/Popup';

class App extends Component {
  state = {
    popupIsOpen: false,
    popupName: '',
    popupData: null,
    userName: '',
    userRole: '',
    userClub: '',
    userAvatar: '',
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
      userAvatar: this.state.userAvatar,
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
      userAvatar: user.avatar,
      hasAuth: true,
    }, this.saveUser);
  }

  onLogout = () => {
    this.setState({
      userName: '',
      userRole: '',
      userClub: '',
      userAvatar: '',
      hasAuth: false,
    }, () => {
      this.saveUser();
    });
  }

  render() {
    let routesByRole;
    if (this.state.userRole === 'operator') {
      routesByRole = (
        <Route 
          path={PAGE_URL.index}
          render={(props) => 
            <IndexOperator
              {...props}
              openPopup={this.openPopup}
              hasAuth={this.state.hasAuth}
              club={this.state.userClub}
            />
          }
        />
      );
    } else if (this.state.userRole === 'agent') {
      routesByRole = (
        <Route
          path={PAGE_URL.index}
          render={(props) =>
            <AgentRoutes
              {...props}
              hasAuth={this.state.hasAuth}
              openPopup={this.openPopup}
            />
          }
        />
      );
    } else if (this.state.userRole === 'root') {
      routesByRole = (
        <Route
          path={PAGE_URL.index}
          render={(props) =>
            <AdminRoutes
              {...props}
              openPopup={this.openPopup}
              hasAuth={this.state.hasAuth}
            />
          }
        />
      );
    } else {
      routesByRole = <Redirect to={PAGE_URL.login} />;
    }

    return (
      <Router>
        <Switch>
          <Route path={PAGE_URL.login} exact render={(props) => <Login {...props} onLogin={this.onLogin} hasAuth={this.state.hasAuth} />} />
          <Route path={PAGE_URL.root} exact component={Root} />
          <Route children={(props) =>
            <>
              <Header
                {...props}
                role={this.state.userRole}
                name={this.state.userName}
                avatar={this.state.userAvatar}
                onLogout={this.onLogout}
              />
              {routesByRole}
              <Popup
                {...props}
                isOpen={this.state.popupIsOpen}
                name={this.state.popupName}
                data={this.state.popupData}
                open={this.openPopup}
                close={this.closePopup}
              />
            </>
          }/>
        </Switch>
      </Router>
    );
  }
}

export default App;
