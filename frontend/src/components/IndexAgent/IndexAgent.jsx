import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../Clubs/Clubs.scss';

import Table from '../UI/Table/Table';
import { PAGE_URL } from '../../constants';

const header = ['#', 'Клуб', 'Количество клиентов', 'Дата регистрации', ''];

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
      <div className="page-clubs">
        <Table className="clubs">
          <Table.Header>{header}</Table.Header>
          {
            this.props.clubs.map((club, i) => (
              <Table.Row>
              {[
                i + 1,
                <Link to={`${PAGE_URL.club}/${club.id}${PAGE_URL.clients}`}>{club.name}</Link>,
                club.clientsCount,
                club.created,
                <button>d</button>
              ]}
              </Table.Row> 
            ))
          }
        </Table>
        <button onClick={this.showPopup}>add club</button>
      </div>
    );
  }
}

IndexAgent.propTypes = {

};

export default IndexAgent;