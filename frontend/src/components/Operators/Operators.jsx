import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';

import Tooltip from '../UI/Tooltip/Tooltip';
import Input from '../UI/Input/Input';
import TableWithPagination from '../UI/TableWithPagination/TableWithPagination';
import API from '../../API';

const header = ['#', 'Оператор', 'Клуб', 'Дата регистрации', ''];

class Operators extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      operators: [],
      search: '',
    };
  }

  componentWillMount() {
    this.fetchOps();
  }

  fetchOps = async () => {
    const clubId = this.props.match.params.id;
    const operators = await API.getOperators(clubId);
    if (operators) {
      this.setState({ operators });
    }
  }

  onAddOperator = () => {
    const id = this.props.match.params.id;
    this.props.openPopup('add-operator', { id, callback: this.fetchOps });
  }

  onChangeInput = ({ value }) => {
    this.setState({ search: value, currentPage: 1 });
  }

  filterBySearch = (ops) => {
    return ops.filter(op => op.login.includes(this.state.search));
  }

  toggleLock = (id, status, login) => () => {
    const action = status === 'active' ? 'заблокировать' : 'разблокировать';
    this.props.openPopup('action-confirm', {
      title: 'Блокировка оператора',
      button: action,
      content: `<div>Вы действительно хотите ${action} оператора? <br/><b>${login}</b></div>`,
      callback: async () => {
        let operator;
        if (status === 'active') {
          operator = await API.blockUser(id);
        } else {
          operator = await API.activateUser(id);
        }
        if (operator) {
          this.updateOperators(operator);
        }
      }
    });
  }

  editOperator = (id, name) => () => {
    this.props.openPopup('edit-user', {
      title: 'Редактировать оператора',
      login: name,
      callback: async (login, password) => {
        const response = await API.changeUser(id, login, password);
        if (response.isOk) {
          this.props.openPopup('alert', {
            type: 'success',
            title: 'Оператор изменен',
            text: 'Изменения успешно сохранены'
          });
          this.updateOperators(response.data);
        } else {
          let error = 'Произошла ошибка';
          if (response.data.code === 6) {
            error = 'Такой логин уже зарегистрирован';
          }
          this.props.openPopup('alert', {
            type: 'error',
            title: 'Ошибка',
            text: error,
          });
        }
      }
    });
  }

  updateOperators = (newOp) => {
    const updatedOperators = this.state.operators.map(operator => operator.id === newOp.id ? {...operator, ...newOp} : operator);
    this.setState({ operators: updatedOperators });
  }

  removeOperator = (id, name) => () => {
    this.props.openPopup('action-confirm', {
      title: 'Удаление оператора',
      content: `<div>Вы действительно хотите удалить оператора? <br/><b>${name}</b></div>`,
      callback: async () => {
        const isRemoved = await API.removeOperator(id);
        if (isRemoved) {
          const updatedList = this.state.operators.filter(op => op.id !== id);
          this.setState({ operators: updatedList });
        }
      }
    });
  }

  mappingFn = (operator, i) => {
    const avaClass = cn(`header__avatar_${operator.avatar}`, 'header__avatar_min', 'header__avatar_operator');
    return [
      i + 1,
      <div className={avaClass}>{operator.login}</div>,
      operator.clubName,
      moment(operator.created).format('DD.MM.YYYY HH:mm:ss'),
      <div>
        <Tooltip text='Изменить' leftOffset="-10px">
          <div onClick={this.editOperator(operator.id, operator.login)} className="button-edit" />
        </Tooltip>
        <Tooltip text={operator.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'} leftOffset="-29px">
          <div onClick={this.toggleLock(operator.id, operator.status, operator.login)} className={`button-lock ${operator.status === 'blocked' ? 'button-lock_active' : ''}`} />
        </Tooltip>
        <Tooltip text='Удалить'>
          <div onClick={this.removeOperator(operator.id, operator.login)} className="button-remove" />
        </Tooltip>
      </div>
    ]
  }

  render() {
    const opsWithFilter = this.filterBySearch(this.state.operators);
    return (
      <div className="page page_operators">
        <div className="search-block">
          <div className="search-block__title">Управление операторами</div>
          <div className="search-block__input">
            <Input
              icon="search"
              placeholder="Поиск по имени оператора"
              value={this.state.search}
              onChange={this.onChangeInput} />
          </div>
          <button className="button" type="button" onClick={this.onAddOperator}>
            <span className="button_add">Добавить оператора</span>
          </button>
        </div>
        {
          this.state.operators.length
            ? <TableWithPagination
                className="clubs"
                header={header}
                mappingFn={this.mappingFn}
                data={opsWithFilter}
              />
            : <div className="empty-table">Для клуба нет назначенных операторов</div>
        }
      </div>
    );
  }
}

Operators.propTypes = {
  
};

export default Operators;