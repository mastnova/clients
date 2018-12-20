import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { PAGE_URL } from '../../constants';
import API from '../../API';
import user from '../../utils/user';

class IndexAgent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clubs: []
    };
  }

  componentWillMount() {
    if (!user.hasAuth()) {
      this.props.history.push(PAGE_URL.login)
    } else {
      this.fetchClubs();
    }
  }

  fetchClubs = async () => {
    const clubs = await API.getClubs();
    if (clubs) {
      this.setState({ clubs });
    }
  }

  showPopup = () => {
    this.props.openPopup('add-club');
  }

  render() {
    return (
      <div>
        <p>Index Agent page <button onClick={user.logout}>logout</button></p>
        <ul>
          {
            this.state.clubs.map(club => <li key={club.id}><Link to={`${PAGE_URL.club}/${club.id}`}>{club.name}</Link> - {club.clientsCount} - {club.created}</li>)
          }
        </ul>
        <button onClick={this.showPopup}>add club</button>
      </div>
    );
  }
}

IndexAgent.propTypes = {

};

export default IndexAgent;