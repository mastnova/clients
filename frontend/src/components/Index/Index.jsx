import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { PAGE_URL } from '../../constants';
import API from '../../API';
import user from '../../utils/user';

class Index extends PureComponent {
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
    return (
      <div>
        <p>Index page <button onClick={user.logout}>logout</button></p>
        <ul>
        {
          this.state.users.map(user => <li key={user.id}>{user.login} - {user.role} - {user.created}</li>)
        }
        </ul>
      </div>
    );
  }
}

Index.propTypes = {
  
};

export default Index;