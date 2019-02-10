import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cn from 'classnames';
import { Link } from 'react-router-dom';

import Tooltip from '../UI/Tooltip/Tooltip';
import LongText from '../UI/LongText/LongText';
import TableWithPagination from '../UI/TableWithPagination/TableWithPagination';
import API from '../../API';
import { PAGE_URL } from '../../constants';

const header = ['#', 'Имя', 'Телефон', 'Добавил', 'Дата добавления'];

class Promotion extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
    };
  }

  componentWillMount() {
    this.fetchPromotion();
  }

  fetchPromotion = async () => {
    const id = this.props.match.params.promoId;
    const promotion = await API.getPromotion(id);
    if (promotion) {
      const clients = this.preparedClients(promotion.clients, promotion.id);
      this.setState({ ...promotion, clients });
    }
  }

  editPromotion = () => {

  }

  removePromotion = () => {

  }

  mappingFn = (client, i) => {
    const avaClass = cn(`header__avatar_${client.creator.avatar}`, 'header__avatar_min', 'header__avatar_operator');
    return [
      i + 1,
      <Link to={`${PAGE_URL.club}/${this.props.match.params.id}${PAGE_URL.clients}/${client.id}`}><LongText>{client.name}</LongText></Link>,
      client.phone,
      <div className={avaClass}><LongText>{client.creator.login}</LongText></div>,
      moment(client.date).format('DD.MM.YYYY HH:mm:ss'),
    ]
  };

  preparedClients = (clients, promoId) => {
    const result = [];
    clients.forEach( client => {
      const promotions = client.promotions.filter( promo =>  promo.id === promoId).map( promo => ({creator: promo.creator, date: promo.date}));
      promotions.forEach( (promo, i) => {
        result.push({...client, ...promo, id: client.id + i});
      })
    });
    return result;
  }

  render() {
    const id = this.props.match.params.id;
    const buttons = (
      <div>
        <Tooltip text='Изменить' leftOffset='5px'>
          <div onClick={this.editPromotion(this.state.id, this.state.name, this.state.description)} className="button-edit button-edit_big" />
        </Tooltip>
        <Tooltip text='Удалить' leftOffset='12px'>
          <div onClick={this.removePromotion(this.state.id)} className="button-remove button-remove_big" />
        </Tooltip>
      </div>
    );
    return (
      <div className="page page_club">
        <div className="unit-header unit-header_club">
          <div className="long-text" style={{ width: '80%' }}>Акция - {this.state.name}</div>
          <div className="unit-header__remove">
            {
              this.state.status === 'removed'
                ? <div className="removed-text">Удалена</div>
                : buttons
            }
          </div>
        </div>
        {Boolean(this.state.clients.length) &&
          <TableWithPagination
            className="clubs"
            header={header}
            mappingFn={this.mappingFn}
            data={this.state.clients}
          />
        }
      </div>
    );
  }
}

Promotion.propTypes = {
  
};

export default Promotion;