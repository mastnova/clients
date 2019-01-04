import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Table from '../UI/Table/Table';
import Tooltip from '../UI/Tooltip/Tooltip';
import Input from '../UI/Input/Input';
import { PAGE_URL } from '../../constants';
import API from '../../API';

const header = ['#', 'Имя клиента', 'Телефон', 'Акции', 'Добавил', 'Дата регистрации', ''];

class Clients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      search: '',
    };
  }

  componentWillMount() {
    this.fetchClients();
  }

  fetchClients = async () => {
    const clubId = this.props.match.params.id;
    const clients = await API.getClients(clubId);
    if (clients) {
      this.setState({clients});
    }
  }

  onChangeInput = ({ value }) => {
    this.setState({ search: value });
  }

  filterBySearch = (clients) => {
    return clients.filter(client => client.name.includes(this.state.search) || client.phone.includes(this.state.search) || client.creator.includes(this.state.search));
  }

  removeClient = (id, name) => () => {
    this.props.openPopup('remove-confirm', {
      title: 'Удаление клиента',
      content: `<div>Вы действительно хотите удалить клиента? <br/><b>${name}</b></div>`,
      callback: async () => {
        const isRemoved = await API.removeClient(id);
        if (isRemoved) {
          const updatedClients = this.state.clients.filter(client => client.id !== id);
          this.setState({ clients: updatedClients });
        }
      }
    });
  }

  render() {
    const filteredClients = this.filterBySearch(this.state.clients);
    return (
      <div className="page page_clients">
        <div className="search-block">
          <div className="search-block__title">Список Клиентов</div>
          <div className="search-block__input">
            <Input
              icon="search"
              placeholder="Поиск"
              value={this.state.search}
              onChange={this.onChangeInput} />
          </div>
          <p></p>
        </div>
        {
          this.state.clients.length
            ? <Table className="clubs">
              <Table.Header>{header}</Table.Header>
              {
                filteredClients.map((client, i) => (
                  <Table.Row>
                    {[
                      i + 1,
                      <Link to={`${PAGE_URL.club}/${this.props.match.params.id}${PAGE_URL.clients}/${client.id}`}>{client.name}</Link>,
                      client.phone,
                      client.promotions.length,
                      client.creator,
                      moment(client.created).format('DD.MM.YYYY'),
                      <div>
                        <Tooltip text='Удалить'>
                          <div onClick={this.removeClient(client.id, client.name)} className="button-remove" />
                        </Tooltip>
                      </div>
                    ]}
                  </Table.Row>
                ))
              }
            </Table>
            : <div className="empty-table">В клубе нет клиентов</div>
        }
      </div>
    );
  }
}

Clients.propTypes = {
  
};

export default Clients;