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
      agents: [],
      clubs: [],
      selectedClubId: null,
      clubName: '',
    };
  }

  componentWillMount() {
    if (!this.props.hasAuth) {
      this.props.history.push(PAGE_URL.login)
    } else {
      this.fetchData();
    }
  }

  fetchData = () => {
    Promise.all([this.fetchClubs(), this.fetchAgents()]).then((responses) => {
      const clubs = responses[0];
      const agents = responses[1];
      const counters = {};
      clubs.forEach(club => {
        counters[club.owner] = counters[club.owner] ? counters[club.owner] + club.clientsCount : club.clientsCount;
      });
      const updatedAgents = agents.map(agent => ({ ...agent, clientsCount: counters[agent.id] }));
      const agentsNames = {};
      agents.forEach(agent => {
        agentsNames[agent.id] = agent.login;
      });
      const updatedClubs = clubs.map(club => ({...club, ownerName: agentsNames[club.owner]}));
      this.setState({ agents: updatedAgents, clubs: updatedClubs }, () => {
        if (this.state.selectedClubId) {
          this.setClubName()
        }
      });
    });
  }

  fetchAgents = async () => {
    const agents = await API.getAgents();
    return agents;
  }

  fetchClubs = async (id = 'all') => {
    const clubs = await API.getClubs(id);
    return clubs;
  }

  setClubId = (id) => {
    this.setState({ selectedClubId: id }, this.setClubName);
  }

  setClubName = () => {
    const club = this.state.clubs.find(club => club.id === this.state.selectedClubId) || {};
    this.setState({ clubName: club.name ? `(${club.name})` : ''});
  }

  updateClubs = (newClub) => {
    if (!newClub) return;
    const updatedClubs = this.state.clubs.map(club => (
      {
        ...club,
        status: club.id === newClub.id ? newClub.status : club.status,
    }));
    this.setState({ clubs: updatedClubs });
  }

  updateAgents = (newAgent) => {
    this.fetchData();
    // if (!newAgent) return;
    // const updatedAgents = this.state.agents.map(agent => (
    //   {
    //     ...agent,
    //     status: agent.id === newAgent.id ? newAgent.status : agent.status,
    //   }));
    // this.setState({ agents: updatedAgents });
  }

  render() {
    return (
      <div className="page-container">
        <Route path={[`${PAGE_URL.club}/:id`, PAGE_URL.index]} component={MenuAdmin} />
        <Route render={(props) => <Breadcrumbs {...props} setClubId={this.setClubId} clubName={this.state.clubName} />} />
        <Route path={PAGE_URL.index} exact render={(props) => <Index {...props} openPopup={this.props.openPopup} users={this.state.agents} updateAgents={this.updateAgents}/>} />
        <Switch>
          <Route path={`${PAGE_URL.clubs}/all`} exact render={(props) => <Clubs {...props} openPopup={this.props.openPopup} clubs={this.state.clubs} updateClubs={this.updateClubs}/>} />
          <Route path={`${PAGE_URL.clubs}/:agentId`} exact render={(props) => <Clubs {...props} openPopup={this.props.openPopup} clubs={this.state.clubs} updateClubs={this.updateClubs}/>} />
        </Switch>
        <Route path={`${PAGE_URL.club}/:id`} exact render={(props) => <Club {...props} openPopup={this.props.openPopup} />} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.operators}`} exact render={(props) => <Operators {...props} openPopup={this.props.openPopup} />} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.clients}`} exact render={(props) => <Clients {...props} openPopup={this.props.openPopup} />} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.clients}/:clientId`} exact render={(props) => <Client {...props} openPopup={this.props.openPopup} />} />
      </div>
    );
  }
}

AdminRoutes.propTypes = {

};

export default AdminRoutes;