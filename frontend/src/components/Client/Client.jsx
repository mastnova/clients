import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './Client.scss';

import Table from '../UI/Table/Table';
import Tooltip from '../UI/Tooltip/Tooltip';
import API from '../../API';
import { PAGE_URL } from '../../constants';

const header = ['#', 'Акция', 'Добавил', 'Дата'];

class Client extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {
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

  render() {
    return (
      <div className="page page_client">
        <div className="unit-header unit-header_client">
          Клиент - {this.state.client.name}
          <div className="unit-header__remove">
          {
            this.state.client.status === 'removed'
            ? <div className="removed-text">Удален</div>
            : <Tooltip text='Удалить' leftOffset='12px'>
                <div onClick={this.removeClient(this.state.client.id, this.state.client.name)} className="button-remove button-remove_big" />
              </Tooltip>
          }
          </div>
        </div>
        <div className="unit-info">
          <div className="unit-info__label unit-info__label_username">
            <div className="unit-info__name">Имя</div>
            <div className="unit-info__text">{this.state.client.name}</div>
          </div>
          <div className="unit-info__label unit-info__label_phone">
            <div className="unit-info__name">Телефон</div>
            <div className="unit-info__text">{this.state.client.phone}</div>
          </div>
          <div className="unit-info__label unit-info__label_creator">
            <div className="unit-info__name">Добавил</div>
            <div className="unit-info__text">{this.state.client.creator}</div>
          </div>
          <div className="unit-info__label unit-info__label_created">
            <div className="unit-info__name">Дата регистрации</div>
            <div className="unit-info__text">{moment(this.state.client.created).format('DD.MM.YYYY')}</div>
          </div>
        </div>
        
        {Boolean(this.state.client.promotions.length) &&
          <Table className="clubs">
            <Table.Header>{header}</Table.Header>
            {
              this.state.client.promotions.map((promo, i) => (
                <Table.Row key={promo.id}>
                  {[
                    i + 1,
                    promo.name,
                    promo.creator,
                    moment(promo.date).format('DD.MM.YYYY')
                  ]}
                </Table.Row>
              ))
            }
          </Table>
        }
      </div>
    );
  }
}

Client.propTypes = {
  
};

export default Client;