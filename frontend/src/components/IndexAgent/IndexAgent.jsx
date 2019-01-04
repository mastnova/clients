import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import '../Clubs/Clubs.scss';

import Table from '../UI/Table/Table';
import Tooltip from '../UI/Tooltip/Tooltip';
import Input from '../UI/Input/Input';
import { PAGE_URL } from '../../constants';
import API from '../../API';

const header = ['#', 'Клуб', 'Количество клиентов', 'Дата регистрации', ''];

class IndexAgent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
  }

  showPopup = () => {
    this.props.openPopup('add-club', {callback: this.props.updateClubs});
  }

  onChangeInput = ({value}) => {
    this.setState({search: value});
  }

  filterBySearch = (clubs) => {
    return clubs.filter( club => club.name.includes(this.state.search) );
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
    const filteredClubs = this.filterBySearch(this.props.clubs);
    return (
      <div className="page page_clubs">
        <div className="search-block">
          <div className="search-block__title">Управление клубами</div>
          <div className="search-block__input">
            <Input 
              icon="search"
              placeholder="Поиск по названию клуба"
              value={this.state.search}
              onChange={this.onChangeInput}/>
          </div>
          <button className="button" type="button" onClick={this.showPopup}>
            <span className="button_add">Создать клуб</span>
          </button>
        </div>
        {
          this.props.clubs.length
          ? <Table className="clubs">
              <Table.Header>{header}</Table.Header>
              {
                filteredClubs.map((club, i) => (
                  <Table.Row>
                  {[
                    i + 1,
                    <Link to={`${PAGE_URL.club}/${club.id}${PAGE_URL.clients}`}>{club.name}</Link>,
                    club.clientsCount,
                    moment(club.created).format('DD.MM.YYYY'),
                    <div>
                      <Tooltip text={club.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'} leftOffset="-29px">
                        <div onClick={this.toggleLock(club.id, club.status)} className={`button-lock ${club.status === 'blocked' ? 'button-lock_active' : ''}`}/>
                      </Tooltip>
                      <Tooltip text='Удалить'>
                        <div onClick={this.props.removeClub(club.id, club.name)} className="button-remove"/>
                      </Tooltip>
                    </div>
                  ]}
                  </Table.Row> 
                ))
              }
            </Table>
            : <div className="empty-table">Нет доступных клубов</div>
         }
      </div>
    );
  }
}

IndexAgent.propTypes = {

};

export default IndexAgent;