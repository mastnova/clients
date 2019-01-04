import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';

import MenuAgent from './components/MenuAgent/MenuAgent';
import IndexAgent from './components/IndexAgent/IndexAgent';
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
      clubs: [],
      selectedClubId: null,
      selectedClubName: '',
    };
  }

  componentWillMount() {
    if (!this.props.hasAuth) {
      this.props.history.push(PAGE_URL.login)
    } else {
      this.fetchClubs();
    }
  }

  fetchClubs = async () => {
    const clubs = await API.getClubs();
    if (clubs) {
      this.setState({ clubs }, this.setClubName);
    }
  }

  setClubId = (id) => {
    this.setState({ selectedClubId: id }, this.setClubName);
  }

  setClubName = () => {
    const club = this.state.clubs.find(club => club.id === this.state.selectedClubId) || {};
    this.setState({
      selectedClubName: club.name ? `(${club.name})` : '',
    });
  }

  updateClubs = (newClub) => {
    if (!newClub) {
      this.fetchClubs();
      return;
    };
    const updatedClubs = this.state.clubs.map( club => club.id === newClub.id ? newClub : club);
    this.setState({clubs: updatedClubs});
  }

  removeClub = (id, name) => () => {
    this.props.openPopup('remove-confirm', {
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

  render() {
    return (
      <div className="page-container">
        <Route path={[`${PAGE_URL.club}/:id`, PAGE_URL.index]} component={MenuAgent} />
        <Route render={(props) => <Breadcrumbs {...props} setClubId={this.setClubId} clubName={this.state.selectedClubName}/>}/>
        <Route path={PAGE_URL.index} exact render={(props) => <IndexAgent {...props} openPopup={this.props.openPopup} clubs={this.state.clubs} updateClubs={this.updateClubs} removeClub={this.removeClub}/>} />
        <Route path={`${PAGE_URL.club}/:id`} exact render={(props) => <Club {...props} openPopup={this.props.openPopup} removeClub={this.removeClub}/>} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.operators}`} exact render={(props) => <Operators {...props} openPopup={this.props.openPopup}/>} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.clients}`} exact render={(props) => <Clients {...props} openPopup={this.props.openPopup}/>} />
        <Route path={`${PAGE_URL.club}/:id${PAGE_URL.clients}/:clientId`} exact render={(props) => <Client {...props} openPopup={this.props.openPopup}/>} />
      </div>
    );
  }
}

AgentRoutes.propTypes = {
  
};

export default AgentRoutes;