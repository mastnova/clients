import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PAGE_URL } from '../../constants';
import API from '../../API';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentWillMount() {
    const hasAuth = sessionStorage.getItem('userHasAuth');
    if (!hasAuth) {
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

  render() {
    console.warn(this.state.users)
    return (
      <div>
        <p>Index page</p>
        <ul>
        {
          this.state.users.map(user => <li>{user.login} - {user.role} - {user.created}</li>)
        }
        </ul>
      </div>
    );
  }
}

Index.propTypes = {
  
};

export default Index;