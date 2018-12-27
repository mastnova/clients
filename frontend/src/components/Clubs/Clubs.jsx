import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { PAGE_URL } from '../../constants';
import API from '../../API';

class Clubs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getClubs() {
    const id = this.props.match.params.agentId;
    if (!id) {
      return this.props.clubs;
    }
    return this.props.clubs.filter( club => club.owner === id)
  }

  render() {
    const clubs = this.getClubs();
    return (
      <div>Clubs
        {
          clubs.map(club => <p><Link to={`${PAGE_URL.club}/${club.id}${PAGE_URL.clients}`}>{club.name}</Link></p>)
        }
      </div>
    );
  }
}

Clubs.propTypes = {
  
};

export default Clubs;