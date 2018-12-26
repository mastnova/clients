import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';

import MenuAgent from './components/MenuAgent/MenuAgent';
import Index from './components/Index/Index';
import Club from './components/Club/Club';
import Operators from './components/Operators/Operators';
import Clients from './components/Clients/Clients';
import Client from './components/Client/Client';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import { PAGE_URL } from './constants';
import API from './API';

class AgentRoutes extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentWillMount() {
    if (!this.props.hasAuth) {
      this.props.history.push(PAGE_URL.login)
    } else {
      this.fetchUsers();
    }
  }

  fetchUsers = async () => {
    const users = await API.getUsers();
    if (users) {
      this.setState({ users });
    }
  }

  setClubId = (id) => {
    this.setState({ selectedClubId: id }, this.setClubName);
  }

  setClubName = () => {
    const club = this.state.clubs.find(club => club.id === this.state.selectedClubId) || {};
    this.setState({
      selectedClubName: club.name || '',
    });
  }

  render() {
    return (
      <div>
        {/* <Route path={[`${PAGE_URL.club}/:id`, PAGE_URL.index]} component={MenuAgent} /> */}
        {/* <Route render={(props) => <Breadcrumbs {...props} setClubId={this.setClubId} clubName={this.state.selectedClubName} />} /> */}
        <Route path={PAGE_URL.index} exact render={(props) => <Index {...props} openPopup={this.props.openPopup} users={this.state.users} />} />
        <Route path={`${PAGE_URL.club}/:id`} exact render={(props) => <Club {...props} openPopup={this.openPopup} />} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.operators}`} exact render={(props) => <Operators {...props} openPopup={this.openPopup} />} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.clients}`} exact render={(props) => <Clients {...props} openPopup={this.openPopup} />} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.clients}/:clientId`} exact render={(props) => <Client {...props} openPopup={this.openPopup} />} />
      </div>
    );
  }
}

AgentRoutes.propTypes = {

};

export default AgentRoutes;