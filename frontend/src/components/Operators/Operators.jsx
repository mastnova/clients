import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Table from '../UI/Table/Table';
import Tooltip from '../UI/Tooltip/Tooltip';
import Input from '../UI/Input/Input';
import API from '../../API';

const header = ['#', 'Оператор', 'Дата регистрации', ''];

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
    this.props.openPopup('add-operator', { id });
  }

  onChangeInput = ({ value }) => {
    this.setState({ search: value });
  }

  filterBySearch = (ops) => {
    return ops.filter(op => op.login.includes(this.state.search));
  }

  render() {
    const filteredOperators = this.filterBySearch(this.state.operators);
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
            <span className="button_add">Создать оператора</span>
          </button>
        </div>
        {
          this.state.operators.length
            ? <Table className="clubs">
              <Table.Header>{header}</Table.Header>
              {
                filteredOperators.map((operator, i) => (
                  <Table.Row>
                    {[
                      i + 1,
                      operator.login,
                      moment(operator.created).format('DD.MM.YYYY'),
                      <div>
                        <Tooltip text='Заблокировать' leftOffset="-29px">
                          <div className="button-lock button-lock_active" />
                        </Tooltip>
                        <Tooltip text='Удалить'>
                          <div className="button-remove" />
                        </Tooltip>
                      </div>
                    ]}
                  </Table.Row>
                ))
              }
            </Table>
            : <div className="empty-table">Для клуба нет назначенных операторов</div>
        }
      </div>
    );
  }
}

Operators.propTypes = {
  
};

export default Operators;