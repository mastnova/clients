import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { PAGE_URL } from '../../constants';

class IndexAgent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  showPopup = () => {
    this.props.openPopup('add-club');
  }

  render() {
    return (
      <div className="operator-index">
        
        <ul>
          {
            this.props.clubs.map(club => <li key={club.id}><Link to={`${PAGE_URL.club}/${club.id}${PAGE_URL.clients}`}>{club.name}</Link> - {club.clientsCount} - {club.created}</li>)
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