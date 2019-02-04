import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import '../Clubs/Clubs.scss';

import Tooltip from '../UI/Tooltip/Tooltip';
import Input from '../UI/Input/Input';
import LongText from '../UI/LongText/LongText';
import { PAGE_URL } from '../../constants';
import TableWithPagination from '../UI/TableWithPagination/TableWithPagination';
import API from '../../API';

const header = ['#', 'Клуб', 'Количество клиентов', 'Дата регистрации', ''];

class IndexAgent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
  }

  componentWillMount() {
    this.props.updateClubs();
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

  toggleLock = (id, status, name) => () => {
    const action = status === 'active' ? 'заблокировать' : 'разблокировать';
    this.props.openPopup('action-confirm', {
      title: 'Блокировка клуба',
      button: action,
      content: `<div>Вы действительно хотите ${action} клуб? <br/><b>${name}</b></div>`,
      callback: async () => {
        let club;
        if (status === 'active') {
          club = await API.blockClub(id);
        } else {
          club = await API.activateClub(id);
        }
        this.props.updateClubs(club);
      }
    });
  }

  editClub = (id, name) => () => {
    this.props.openPopup('edit-name', {
      title: 'Редактировать клуб',
      input: {
        name: 'Название клуба',
        placeholder: 'Введите название клуба',
        icon: 'club',
        value: name,
      },
      callback: async (newName) => {
        const club = await API.changeClubName(id, newName);
        this.props.updateClubs(club);
      }
    });
  }

  mappingFn = (club, i) => [
    i + 1,
    <Link to={`${PAGE_URL.club}/${club.id}${PAGE_URL.clients}`}><LongText>{club.name}</LongText></Link>,
    club.clientsCount,
    moment(club.created).format('DD.MM.YYYY HH:mm:ss'),
    <div>
      <Tooltip text='Изменить' leftOffset="-10px">
        <div onClick={this.editClub(club.id, club.name)} className="button-edit" />
      </Tooltip>
      <Tooltip text={club.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'} leftOffset="-29px">
        <div onClick={this.toggleLock(club.id, club.status, club.name)} className={`button-lock ${club.status === 'blocked' ? 'button-lock_active' : ''}`} />
      </Tooltip>
      <Tooltip text='Удалить'>
        <div onClick={this.props.removeClub(club.id, club.name)} className="button-remove" />
      </Tooltip>
    </div>
  ]

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
          ? <TableWithPagination
              className="clubs"
              header={header}
              mappingFn={this.mappingFn}
              data={filteredClubs}
            />
            : <div className="empty-table">Нет доступных клубов</div>
        }
      </div>
    );
  }
}

IndexAgent.propTypes = {

};

export default IndexAgent;