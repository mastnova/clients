import React, { Component } from 'react';
import PropTypes from 'prop-types';

import API from '../../API';

class Client extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {},
    };
  }

  componentWillMount() {
    this.fetchClient();
  }

  fetchClient = async () => {
    const id = this.props.match.params.clientId;
    const client = await API.getClient(id);
    if (client) {
      this.setState({ client });
    }
  }

  render() {
    return (
      <div>
        <p>client - {this.state.client.name}</p>
        {this.state.client.actions && this.state.client.actions.map(a => <div>{a.name}</div>)}
      </div>
    );
  }
}

Client.propTypes = {
  
};

export default Client;