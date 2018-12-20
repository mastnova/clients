import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import API from '../../API';

class Club extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      club: {},
    };
  }

  componentWillMount() {
    this.fetchClub();
  }

  fetchClub = async () => {
    const id = this.props.match.params.id;
    const club = await API.getClub(id);
    if (club) {
      this.setState({ club });
    }
  }

  onAddPromo = () => {
    this.props.openPopup('add-promo', { id: this.state.club.id});
  }

  render() {
    const id = this.props.match.params.id;
    return (
      <div>
        <p>client - {this.state.club.name}</p>
        <button onClick={this.onAddPromo}>Add promo</button>
        {this.state.club.promotions && this.state.club.promotions.map(a => <div>{a.name} - {a.description}</div>)}
        <Link to={id + '/operators'}>operators</Link>
      </div>
    );
  }
}

Club.propTypes = {

};

export default Club;