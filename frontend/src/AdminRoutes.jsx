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

  fetchData = (status = 'active') => {
    Promise.all([this.fetchClubs('all', status), this.fetchAgents()]).then((responses) => {
      const clubs = responses[0];
      const agents = responses[1];
      const counters = {};
      clubs.forEach(club => {
        counters[club.owner] = counters[club.owner] ? counters[club.owner] + 1 : 1;
      });
      const updatedAgents = agents.map(agent => ({ ...agent, clubsCount: counters[agent.id] || 0 }));
      const agentsNames = {};
      agents.forEach(agent => {
        agentsNames[agent.id] = agent.login;
      });
      const updatedClubs = clubs.map(club => ({...club, ownerName: agentsNames[club.owner]}));
      this.setState({ agents: updatedAgents, clubs: updatedClubs }, () => {
        if (this.state.selectedClubId) {
          this.setClubName();
        }
      });
    });
  }

  fetchAgents = async () => {
    const agents = await API.getAgents();
    return agents;
  }

  fetchClubs = async (id = 'all', status) => {
    const clubs = await API.getClubs(id, status);
    return clubs;
  }

  setClubId = (id) => {
    this.setState({ selectedClubId: id }, this.setClubName);
  }

  setClubName = () => {
    const club = this.state.clubs.find(club => club.id === this.state.selectedClubId) || {};
    this.setState({ clubName: club.name ? `(${club.name})` : ''});
  }

  updateClubs = (newClub, status) => {
    if (!newClub) {
      this.fetchData(status);
      return;
    };
    const updatedClubs = this.state.clubs.map(club => (
      {
        ...club,
        status: club.id === newClub.id ? newClub.status : club.status,
    }));
    this.setState({ clubs: updatedClubs });
  }

  updateAgents = () => {
    this.fetchData();
  }

  removeClub = (id, name) => async () => {
    this.props.openPopup('action-confirm', {
      title: 'Удаление клуба',
      content: `<div>Вы действительно хотите удалить клуб? <br/><b>${name}</b></div>`,
      callback: async () => {
        const isRemoved = await API.removeClub(id);
        if (isRemoved) {
          const updatedClubs = this.state.clubs.filter(club => club.id !== id);
          this.setState({ clubs: updatedClubs });
        }
      }
    });
  }

  removeAgent = (id, name) => () => {
    this.props.openPopup('action-confirm', {
      title: 'Удаление агента',
      content: `<div>Вы действительно хотите удалить агента? <br/><b>${name}</b></div>`,
      callback: async () => {
        const isRemoved = await API.removeAgent(id);
        if (isRemoved) {
          const updatedAgents = this.state.agents.filter(agent => agent.id !== id);
          this.setState({ agents: updatedAgents });
        }
      }
    });
  }

  render() {
    return (
      <div className="page-container">
        <Route path={[`${PAGE_URL.club}/:id`, PAGE_URL.index]} component={MenuAdmin} />
        <Route render={(props) => <Breadcrumbs {...props} setClubId={this.setClubId} clubName={this.state.clubName} />} />
        <Route path={PAGE_URL.index} exact render={(props) => <Index {...props} openPopup={this.props.openPopup} users={this.state.agents} updateAgents={this.updateAgents} removeAgent={this.removeAgent}/>} />
        <Switch>
          <Route path={`${PAGE_URL.clubs}/all`} exact render={(props) => <Clubs {...props} openPopup={this.props.openPopup} clubs={this.state.clubs} updateClubs={this.updateClubs} removeClub={this.removeClub} status="active"/>} />
          <Route path={`${PAGE_URL.clubs}/removed`} exact render={(props) => <Clubs {...props} openPopup={this.props.openPopup} clubs={this.state.clubs} updateClubs={this.updateClubs} removeClub={this.removeClub} status="removed"/>} />
          <Route path={`${PAGE_URL.clubs}/:agentId/removed`} exact render={(props) => <Clubs {...props} openPopup={this.props.openPopup} clubs={this.state.clubs} updateClubs={this.updateClubs} removeClub={this.removeClub} status="removed"/>} />
          <Route path={`${PAGE_URL.clubs}/:agentId`} exact render={(props) => <Clubs {...props} openPopup={this.props.openPopup} clubs={this.state.clubs} updateClubs={this.updateClubs} removeClub={this.removeClub} status="active"/>} />
        </Switch>
        <Route path={`${PAGE_URL.club}/:id`} exact render={(props) => <Club {...props} openPopup={this.props.openPopup} removeClub={this.removeClub} />} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.operators}`} exact render={(props) => <Operators {...props} openPopup={this.props.openPopup} />} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.clients}`} exact render={(props) => <Clients {...props} openPopup={this.props.openPopup} clubName={this.state.clubName}/>} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.clients}/:clientId`} exact render={(props) => <Client {...props} openPopup={this.props.openPopup} />} />
      </div>
    );
  }
}

AdminRoutes.propTypes = {

};

export default AdminRoutes;