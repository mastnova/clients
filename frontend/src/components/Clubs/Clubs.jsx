import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Table from '../UI/Table/Table';
import Tooltip from '../UI/Tooltip/Tooltip';
import Input from '../UI/Input/Input';
import { PAGE_URL } from '../../constants';
import API from '../../API';

const header = ['#', 'Клуб', 'Количество клиентов', 'Агент клуба', 'Дата создания', ''];

class Clubs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
  }

  getClubs() {
    const id = this.props.match.params.agentId;
    if (!id) {
      return this.props.clubs.filter(club => club.name.includes(this.state.search))
    }
    return this.props.clubs.filter(club => club.owner === id && club.name.includes(this.state.search) )
  }

  onChangeInput = ({ value }) => {
    this.setState({ search: value });
  }

  toggleLock = (id, status) => async () => {
    let club;
    if (status === 'active') {
      club = await API.blockClub(id);
    } else {
      club = await API.activateClub(id);
    }
    this.props.updateClubs(club);
  }

  render() {
    const clubs = this.getClubs();

    return (
      <div className="page page_clubs">
        <div className="search-block">
          <div className="search-block__title">Управление клубами</div>
          <div className="search-block__input">
            <Input
              icon="search"
              placeholder="Поиск по названию клуба"
              value={this.state.search}
              onChange={this.onChangeInput} />
          </div>
          <p></p>
        </div>
        {
          clubs.length
            ? <Table className="clubsall">
              <Table.Header>{header}</Table.Header>
              {
                clubs.map((club, i) => (
                  <Table.Row key={club.id}>
                    {[
                      i + 1,
                      <Link to={`${PAGE_URL.club}/${club.id}${PAGE_URL.clients}`}>{club.name}</Link>,
                      club.clientsCount,
                      club.ownerName,
                      moment(club.created).format('DD.MM.YYYY'),
                      <div>
                        <Tooltip text={club.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'} leftOffset="-29px">
                          <div onClick={this.toggleLock(club.id, club.status)} className={`button-lock ${club.status === 'blocked' ? 'button-lock_active' : ''}`} />
                        </Tooltip>
                        <Tooltip text='Удалить'>
                          <div onClick={this.props.removeClub(club.id, club.name)} className="button-remove" />
                        </Tooltip>
                      </div>
                    ]}
                  </Table.Row>
                ))
              }
            </Table>
            : <div className="empty-table">Список клубов пуст</div>
        }
      </div>
    );
  }
}

Clubs.propTypes = {
  
};

export default Clubs;