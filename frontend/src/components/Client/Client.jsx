import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import './Client.scss';

import TableWithPagination from '../UI/TableWithPagination/TableWithPagination';
import Tooltip from '../UI/Tooltip/Tooltip';
import LongText from '../UI/LongText/LongText';
import { PAGE_URL } from '../../constants';
import API from '../../API';

const header = ['#', 'Акция', 'Добавил', 'Дата'];

class Client extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {
        creator: {
          login: '',
          avatar: 0,
        },
        promotions: []
      },
    };
  }

  componentWillMount() {
    this.fetchClient();
  }

  fetchClient = async () => {
    const id = this.props.match.params.clientId;
    const client = await API.getClient(id);
    if (client) {
      this.setState({ client });
    }
  }

  removeClient = (id, name) => () => {
    this.props.openPopup('action-confirm', {
      title: 'Удаление клиента',
      content: `<div>Вы действительно хотите удалить клиента? <br/><b>${name}</b></div>`,
      callback: async () => {
        const isRemoved = await API.removeClient(id);
        if (isRemoved) {
          this.props.history.goBack();
        }
      }
    });
  }

  editClient = (id, name) => () => {
    this.props.openPopup('edit-name', {
      title: 'Редактировать клиента',
      input: {
        name: 'Имя клиента',
        placeholder: 'Введите имя клиента',
        icon: 'login',
        value: name,
      },
      callback: async (newName) => {
        const client = await API.changeClientName(id, newName);
        this.setState({
          client: {
            ...this.state.client,
            name: newName,
          }
        });
      }
    });
  }

  mappingFn = (promo, i) => {
    const avaClass = cn(`header__avatar_${promo.creator.avatar}`, 'header__avatar_min', 'header__avatar_operator');
    const status = promo.status === 'removed' ? <span style={{color: '#ff6262', paddingLeft: '20px'}}>(удалена)</span> : '';
    let promoName = <Link to={`${PAGE_URL.club}/${this.props.match.params.id}${PAGE_URL.promotion}/${promo.id}`}><LongText>{promo.name}</LongText></Link>;
    if (promo.status === 'removed') {
      promoName = <LongText>{promo.name}</LongText>;
    }
    return [
      <span>{i + 1}{status}</span>,
      promoName,
      <div className={avaClass}><LongText>{promo.creator.login}</LongText></div>,
      moment(promo.date).format('DD.MM.YYYY HH:mm:ss')
    ]
  }

  render() {
    const buttons = (
      <div>
        <Tooltip text='Изменить' leftOffset='5px'>
          <div onClick={this.editClient(this.state.client.id, this.state.client.name)} className="button-edit button-edit_big" />
        </Tooltip>
        <Tooltip text='Удалить' leftOffset='12px'>
          <div onClick={this.removeClient(this.state.client.id, this.state.client.name)} className="button-remove button-remove_big" />
        </Tooltip>
      </div>
    );
    return (
      <div className="page page_client">
        <div className="unit-header unit-header_client">
          <div className="long-text" style={{ width: '80%' }}>Клиент - {this.state.client.name}</div>
          <div className="unit-header__remove">
          {
            this.state.client.status === 'removed'
            ? <div className="removed-text">Удален</div>
            : buttons
          }
          </div>
        </div>
        <div className="unit-info">
          <div className="unit-info__label unit-info__label_username">
            <div className="unit-info__name">Имя</div>
            <div className="unit-info__text"><LongText>{this.state.client.name}</LongText></div>
          </div>
          <div className="unit-info__label unit-info__label_phone">
            <div className="unit-info__name">Телефон</div>
            <div className="unit-info__text">{this.state.client.phone}</div>
          </div>
          <div className="unit-info__label unit-info__label_creator">
            <div className="unit-info__name">Добавил</div>
            <div className="unit-info__text"><LongText>{this.state.client.creator.login}</LongText></div>
          </div>
          <div className="unit-info__label unit-info__label_created">
            <div className="unit-info__name">Дата регистрации</div>
            <div className="unit-info__text">{moment(this.state.client.created).format('DD.MM.YYYY HH:mm:ss')}</div>
          </div>
        </div>
        
        {Boolean(this.state.client.promotions.length) &&
          <TableWithPagination
            className="clubs"
            header={header}
            mappingFn={this.mappingFn}
            data={this.state.client.promotions}
          />
        }
      </div>
    );
  }
}

Client.propTypes = {
  
};

export default Client;