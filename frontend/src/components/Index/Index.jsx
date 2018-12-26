import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { PAGE_URL } from '../../constants';
import API from '../../API';

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  showPopup = () => {
    this.props.openPopup('add-agent');
  }

  render() {
    return (
      <div>
        <p>Index page <button onClick={this.props.onLogout}>logout</button></p>
        <ul>
        {
            this.props.users.map(user => <li key={user.id}><Link to={`${PAGE_URL.clients}/${user.id}`}>{user.login}</Link> - {user.role} - {user.created}</li>)
        }
        </ul>
        <button onClick={this.showPopup}>add agent</button>
      </div>
    );
  }
}

Index.propTypes = {
  
};

export default Index;