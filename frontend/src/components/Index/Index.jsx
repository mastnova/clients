import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './Index.scss';

import TableWithPagination from '../UI/TableWithPagination/TableWithPagination';
import Tooltip from '../UI/Tooltip/Tooltip';
import Input from '../UI/Input/Input';
import { PAGE_URL } from '../../constants';
import API from '../../API';

const header = ['#', 'Агент', 'Количество клубов', 'Дата создания', ''];

class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
  }

  componentWillMount() {
    this.props.updateAgents();
  }

  showPopup = () => {
    this.props.openPopup('add-agent', { callback: this.props.updateAgents});
  }

  onChangeInput = ({ value }) => {
    this.setState({ search: value });
  }

  filterBySearch = (users) => {
    return users.filter(user => user.login.includes(this.state.search));
  }

  toggleLock = (id, status, login) => () => {
    const action = status === 'active' ? 'заблокировать' : 'разблокировать';
    this.props.openPopup('action-confirm', {
      title: 'Блокировка агента',
      button: action,
      content: `<div>Вы действительно хотите ${action} агента? <br/><b>${login}</b></div>`,
      callback: async () => {
        let agent;
        if (status === 'active') {
          agent = await API.blockUser(id);
        } else {
          agent = await API.activateUser(id);
        }
        this.props.updateAgents();
      }
    });
  }

  mappingFn = (agent, i) => [
    i + 1,
    <Link to={`${PAGE_URL.clubs}/${agent.id}`}>{agent.login}</Link>,
    agent.clubsCount,
    moment(agent.created).format('DD.MM.YYYY'),
    <div>
      <Tooltip text={agent.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'} leftOffset="-29px">
        <div onClick={this.toggleLock(agent.id, agent.status, agent.login)} className={`button-lock ${agent.status === 'blocked' ? 'button-lock_active' : ''}`} />
      </Tooltip>
      <Tooltip text='Удалить'>
        <div onClick={this.props.removeAgent(agent.id, agent.login)} className="button-remove" />
      </Tooltip>
    </div>
  ]

  render() {
    const filteredAgents = this.filterBySearch(this.props.users);
    return (
      <div className="page page_index">
        <div className="search-block">
          <div className="search-block__title">Управление агентами</div>
          <div className="search-block__input">
            <Input
              icon="search"
              placeholder="Поиск по имени агента"
              value={this.state.search}
              onChange={this.onChangeInput} />
          </div>
          <button className="button" type="button" onClick={this.showPopup}>
            <span className="button_add">Добавить агента</span>
          </button>
        </div>
        {
          this.props.users.length
          ? <TableWithPagination
              className="agents"
              header={header}
              mappingFn={this.mappingFn}
              data={filteredAgents}
            />
          : <div className="empty-table">Список агентов пуст</div>
        }
      </div>
    );
  }
}

Index.propTypes = {
  
};

export default Index;