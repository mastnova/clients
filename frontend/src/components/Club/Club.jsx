import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './Club.scss';

import Tooltip from '../UI/Tooltip/Tooltip';
import LongText from '../UI/LongText/LongText';
import TableWithPagination from '../UI/TableWithPagination/TableWithPagination';
import { PAGE_URL } from '../../constants';
import API from '../../API';

const header = ['#', 'Акция', 'Описание', 'Дата добавления', ''];

class Club extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      club: {
        promotions: []
      },
    };
  }

  componentWillMount() {
    this.fetchClub();
  }

  fetchClub = async () => {
    const id = this.props.match.params.id;
    const club = await API.getClub(id);
    if (club) {
      this.setState({ club });
    }
  }

  onAddPromo = () => {
    this.props.openPopup('add-promo', { id: this.state.club.id, callback: this.fetchClub});
  }

  removeClub = (id, name) => () => {
    const cb = () => this.props.history.push('/');
    this.props.removeClub(id, name, cb)();
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
        this.setState({
          club: {
            ...this.state.club,
            name: newName,
          }
        });
        this.props.updateClubs(club)
      }
    });
  }

  editPromotion = (id, name, description) => () => {
    this.props.openPopup('edit-promo', {
      name,
      description,
      callback: async (newName, newDesc) => {
        const isOk = await API.changePromotion({id, name: newName, description: newDesc});
        if (isOk) {
          const promotions = this.state.club.promotions.slice();
          const promo = promotions.find(promo => promo.id === id);
          promo.name = newName;
          promo.description = newDesc;
          this.setState({
            club: {
              ...this.state.club,
              promotions,
            }
          });
        }
      }
    });
  }

  toggleLockPromotion = (id, status, name) => () => {
    const action = status === 'active' ? 'заблокировать' : 'разблокировать';
    this.props.openPopup('action-confirm', {
      title: 'Блокировка акции',
      button: action,
      content: `<div>Вы действительно хотите ${action} акцию? <br/><b>${name}</b></div>`,
      callback: async () => {
        const newStatus = status === 'active' ? 'blocked' : 'active';
        const isOk = await API.changePromotion({ id, status: newStatus });
        if (isOk) {
          const promotions = this.state.club.promotions.slice();
          const promo = promotions.find(promo => promo.id === id);
          promo.status = newStatus;
          this.setState({
            club: {
              ...this.state.club,
              promotions,
            }
          });
        }
      }
    });
  }

  removePromotion = (id, name) => () => {
    this.props.openPopup('action-confirm', {
      title: 'Удаление акции',
      content: `<div>Вы действительно хотите удалить акцию? <br/><b>${name}</b></div>`,
      callback: async () => {
        const isRemoved = await API.changePromotion({ id, status: 'removed' });
        if (isRemoved) {
          this.fetchClub();
        }
      }
    });
  }

  mappingFn = (promo, i) => [
    i + 1,
    <Link to={`${PAGE_URL.club}/${this.props.match.params.id}${PAGE_URL.promotion}/${promo.id}`}><LongText>{promo.name}</LongText></Link>,
    <LongText>{promo.description}</LongText>,
    moment(promo.created).format('DD.MM.YYYY HH:mm:ss'),
    <div>
      <Tooltip text='Изменить' leftOffset="-10px">
        <div onClick={this.editPromotion(promo.id, promo.name, promo.description)} className="button-edit" />
      </Tooltip>
      <Tooltip text={promo.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'} leftOffset="-29px">
        <div onClick={this.toggleLockPromotion(promo.id, promo.status, promo.name)} className={`button-lock ${promo.status === 'blocked' ? 'button-lock_active' : ''}`} />
      </Tooltip>
      <Tooltip text='Удалить'>
        <div onClick={this.removePromotion(promo.id, promo.name)} className="button-remove" />
      </Tooltip>
    </div>
  ]

  render() {
    const id = this.props.match.params.id;
    const buttons = (
      <div>
        <Tooltip text='Изменить' leftOffset='5px'>
          <div onClick={this.editClub(this.state.club.id, this.state.club.name)} className="button-edit button-edit_big" />
        </Tooltip>
        <Tooltip text='Удалить' leftOffset='12px'>
          <div onClick={this.removeClub(this.state.club.id, this.state.club.name)} className="button-remove button-remove_big" />
        </Tooltip>
      </div>
    );
    return (
      <div className="page page_club">
        <div className="unit-header unit-header_club">
          <div className="long-text" style={{width: '80%'}}>Клуб - {this.state.club.name}</div>
          <div className="unit-header__remove">
          {
            this.state.club.status === 'removed'
            ? <div className="removed-text">Удален</div>
            : buttons
          }
          </div>
        </div>
        <div className="unit-info">
          <div className="unit-info__label unit-info__label_club">
            <div className="unit-info__name">Название клуба</div>
            <div className="unit-info__text"><LongText>{this.state.club.name}</LongText></div>
          </div>
          <div className="unit-info__label unit-info__label_phone">
            <div className="unit-info__name">Адрес</div>
            <div className="unit-info__text"><LongText>{this.state.club.address}</LongText></div>
          </div>
          <div className="unit-info__label unit-info__label_creator">
            <div className="unit-info__name">Количество клиентов</div>
            <div className="unit-info__text">{this.state.club.clientsCount}</div>
          </div>
          <div className="unit-info__label unit-info__label_created">
            <div className="unit-info__name">Дата регистрации</div>
            <div className="unit-info__text">{moment(this.state.club.created).format('DD.MM.YYYY HH:mm:ss')}</div>
          </div>
        </div>
        {Boolean(this.state.club.promotions.length) &&
          <TableWithPagination 
            className="clubs"
            header={header}
            mappingFn={this.mappingFn}
            data={this.state.club.promotions}
          />
        }
        {this.state.club.status !== 'removed' &&
          <div className="button-wrapper">
            <button className="button" type="button" onClick={this.onAddPromo}>
              <span className="button_add">Создать акцию</span>
            </button>
          </div>
        }
      </div>
    );
  }
}

Club.propTypes = {

};

export default Club;