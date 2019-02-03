import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

import TableWithPagination from '../UI/TableWithPagination/TableWithPagination';
import Tooltip from '../UI/Tooltip/Tooltip';
import Input from '../UI/Input/Input';
import { PAGE_URL } from '../../constants';
import API from '../../API';

const header = ['#', 'Клуб', 'Количество клиентов', 'Агент клуба', 'Дата создания', ''];
const headerRemoved = ['#', 'Клуб', 'Количество клиентов', 'Агент клуба', 'Дата создания', 'Дата удаления'];

class Clubs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      status: 'active',
    };
  }

  componentWillMount() {
    this.props.updateClubs();
  }

  componentWillReceiveProps(props) {
    if (this.state.status !== props.status) {
      this.props.updateClubs(null, props.status);
      this.setState({status: props.status})
    }
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

  mappingFn = (club, i) => {
    let lastColumn = (
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
    );
    if (this.props.status === 'removed') {
      lastColumn = <div>{moment(club.removed).format('DD.MM.YYYY')}</div>;
    }
    return [
      i + 1,
      <Link to={`${PAGE_URL.club}/${club.id}${PAGE_URL.clients}`}>{club.name}</Link>,
      club.clientsCount,
      club.ownerName,
      moment(club.created).format('DD.MM.YYYY'),
      lastColumn
    ]
  }

  render() {
    const clubs = this.getClubs();
    const agentId = this.props.match.params.agentId;
    return (
      <div className="page page_clubs">
        <div className="search-block">
          {this.props.status === 'removed'
            ? <div className="search-block__title search-block__title_red">Удаленные клубы</div>
            : <div className="search-block__title">Управление клубами</div>
          }
          <div className="search-block__input">
            <Input
              icon="search"
              placeholder="Поиск по названию клуба"
              value={this.state.search}
              onChange={this.onChangeInput} />
          </div>
          {
            this.props.status !== 'removed'
            ? <Link to={`${agentId ? agentId + '/' : ''}removed`}><button className="button button_remove button_red">удаленные клубы</button></Link>
            : <button onClick={this.props.history.goBack} className="button button_gray">Вернуться назад</button>
          }
        </div>
        {this.props.status === 'removed' && <div className="crossline" />}
        {
          clubs.length
            ? <TableWithPagination
                className="clubsall"
                header={this.props.status === 'removed' ? headerRemoved : header}
                mappingFn={this.mappingFn}
                data={clubs}
              />
            : <div className="empty-table">Список клубов пуст</div>
        }
      </div>
    );
  }
}

Clubs.propTypes = {
  
};

export default Clubs;