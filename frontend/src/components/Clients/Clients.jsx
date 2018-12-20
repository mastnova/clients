import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { PAGE_URL } from '../../constants';
import API from '../../API';

class Clients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
    };
  }

  componentWillMount() {
    this.fetchClients();
  }

  fetchClients = async () => {
    const id = this.props.match.params.id;
    const clients = await API.getClients(id);
    if (clients) {
      this.setState({clients});
    }
  }

  render() {
    

    return (
      <div>clients
        {this.state.clients.map(c => <div><Link to={`${PAGE_URL.client}/${c.id}`}>{c.name}</Link> - {c.phone}</div>)}
      </div>
    );
  }
}

Clients.propTypes = {
  
};

export default Clients;