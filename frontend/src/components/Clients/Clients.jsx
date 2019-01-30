import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import TableExport from 'tableexport';
import './Clients.scss';

import TableWithPagination from '../UI/TableWithPagination/TableWithPagination';
import Tooltip from '../UI/Tooltip/Tooltip';
import Input from '../UI/Input/Input';
import { PAGE_URL } from '../../constants';
import API from '../../API';

const header = ['#', 'Имя клиента', 'Телефон', 'Акции', 'Добавил', 'Дата регистрации', ''];
const headerRemoved = ['#', 'Имя клиента', 'Телефон', 'Акции', 'Добавил', 'Дата регистрации', 'Дата удаления'];

class Clients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      search: '',
      status: 'active',
    };
  }

  tableId = 'datatable'

  componentWillMount() {
    this.fetchClients();
  }

  fetchClients = async () => {
    const clubId = this.props.match.params.id;
    const clients = await API.getClients(clubId);
    if (clients) {
      const status = clients[0] ? clients[0].status : 'active';
      this.setState({clients, status});
    }
  }

  onChangeInput = ({ value }) => {
    this.setState({ search: value });
  }

  filterBySearch = (clients) => {
    return clients.filter(client => client.name.includes(this.state.search) || client.phone.includes(this.state.search) || client.creator.includes(this.state.search));
  }

  removeClient = (id, name) => () => {
    this.props.openPopup('action-confirm', {
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

  mappingFn = (client, i) => {
    let lastColumn = (
      <div>
        <Tooltip text='Удалить'>
          <div onClick={this.removeClient(client.id, client.name)} className="button-remove" />
        </Tooltip>
      </div>
    );
    if (this.state.status === 'removed') {
      lastColumn = <div>{moment(client.removed).format('DD.MM.YYYY')}</div>;
    }
    return [
      i + 1,
      <Link to={`${PAGE_URL.club}/${this.props.match.params.id}${PAGE_URL.clients}/${client.id}`}>{client.name}</Link>,
      client.phone,
      client.promotions.length,
      client.creator,
      moment(client.created).format('DD.MM.YYYY'),
      lastColumn
    ]
  };

  downloadClients = (type) => () => {
    const date = moment().format('YYYY.MM.DD-HH_mm');
    const table = TableExport(document.getElementById(this.tableId),
      {
        ignoreCols: [0, 6],
        formats: ["xls", "xlsx", "csv"],
        exportButtons: false,
        filename: `clients_${date}`,
        sheetname: "clients",
      }
    );
    let data = table.getExportData();
    data = type === 'xls' ? data[this.tableId].xlsx : data[this.tableId].csv;
    table.export2file(data.data, data.mimeType, data.filename, data.fileExtension);
  }

  render() {
    const filteredClients = this.filterBySearch(this.state.clients);
    return (
      <div className="page page_clients">
        <div className="search-block">
          {this.state.status === 'removed'
            ? <div className="search-block__title search-block__title_red">Удаленные клиенты</div>
            : <div className="search-block__title">Список Клиентов</div>
          }
          <div className="search-block__input">
            <Input
              icon="search"
              placeholder="Поиск"
              value={this.state.search}
              onChange={this.onChangeInput} />
          </div>
          <div>
            <button className="button-file button-file__xls" onClick={this.downloadClients('xls')}></button>
            <button className="button-file button-file__csv" onClick={this.downloadClients('csv')}></button>
          </div>
        </div>
        {this.state.status === 'removed' && <div className="crossline" />}
        {
          this.state.clients.length
            ? <TableWithPagination
                className="clients"
                idName={this.tableId}
                header={this.state.status === 'removed' ? headerRemoved : header}
                mappingFn={this.mappingFn}
                data={filteredClients}
              />
            : <div className="empty-table">В клубе нет клиентов</div>
        }
      </div>
    );
  }
}

Clients.propTypes = {
  
};

export default Clients;