import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';

import MenuAdmin from './components/MenuAdmin/MenuAdmin';
import Index from './components/Index/Index';
import Club from './components/Club/Club';
import Clubs from './components/Clubs/Clubs';
import Operators from './components/Operators/Operators';
import Clients from './components/Clients/Clients';
import Client from './components/Client/Client';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import { PAGE_URL } from './constants';
import API from './API';

class AdminRoutes extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      clubs: [],
      selectedClubId: null,
      clubName: '',
    };
  }

  componentWillMount() {
    if (!this.props.hasAuth) {
      this.props.history.push(PAGE_URL.login)
    } else {
      this.fetchUsers();
      this.fetchClubs();
    }
  }

  fetchUsers = async () => {
    const users = await API.getUsers();
    if (users) {
      this.setState({ users });
    }
  }

  fetchClubs = async (id = 'all') => {
    if (this.state.lastFetchedId === id) {
      return;
    }
    const clubs = await API.getClubs(id);
    if (clubs) {
      this.setState({ clubs }, () => {
        if (this.state.selectedClubId) {
          this.setClubName();
        }
      });
    }
  }

  setClubId = (id) => {
    this.setState({ selectedClubId: id }, this.setClubName);
  }

  setClubName = () => {
    const club = this.state.clubs.find(club => club.id === this.state.selectedClubId) || {};
    this.setState({ clubName: club.name ? `(${club.name})` : ''});
  }

  render() {
    return (
      <div className="page-container">
        <Route path={[`${PAGE_URL.club}/:id`, PAGE_URL.index]} component={MenuAdmin} />
        <Route render={(props) => <Breadcrumbs {...props} setClubId={this.setClubId} clubName={this.state.clubName} />} />
        <Route path={PAGE_URL.index} exact render={(props) => <Index {...props} openPopup={this.props.openPopup} users={this.state.users} />} />
        <Switch>
          <Route path={`${PAGE_URL.clubs}/all`} exact render={(props) => <Clubs {...props} openPopup={this.openPopup} clubs={this.state.clubs}/>} />
          <Route path={`${PAGE_URL.clubs}/:agentId`} exact render={(props) => <Clubs {...props} openPopup={this.openPopup} clubs={this.state.clubs}/>} />
        </Switch>
        <Route path={`${PAGE_URL.club}/:id`} exact render={(props) => <Club {...props} openPopup={this.openPopup} />} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.operators}`} exact render={(props) => <Operators {...props} openPopup={this.openPopup} />} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.clients}`} exact render={(props) => <Clients {...props} openPopup={this.openPopup} />} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.clients}/:clientId`} exact render={(props) => <Client {...props} openPopup={this.openPopup} />} />
      </div>
    );
  }
}

AdminRoutes.propTypes = {

};

export default AdminRoutes;