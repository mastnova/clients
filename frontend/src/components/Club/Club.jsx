import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './Club.scss';

import Tooltip from '../UI/Tooltip/Tooltip';
import TableWithPagination from '../UI/TableWithPagination/TableWithPagination';
import API from '../../API';

const header = ['#', 'Акция', 'Описание', 'Дата добавления'];

const mappingFn = (promo, i) => [
  i + 1,
  promo.name,
  promo.description,
  moment(promo.created).format('DD.MM.YYYY')
]

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

  removeClub = (id) => () => {
    this.props.removeClub(id)();
    this.props.history.push('/');
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

  render() {
    const id = this.props.match.params.id;
    const buttons = (
      <div>
        <Tooltip text='Изменить' leftOffset='5px'>
          <div onClick={this.editClub(this.state.club.id, this.state.club.name)} className="button-edit button-edit_big" />
        </Tooltip>
        <Tooltip text='Удалить' leftOffset='12px'>
          <div onClick={this.removeClub(this.state.club.id)} className="button-remove button-remove_big" />
        </Tooltip>
      </div>
    );
    return (
      <div className="page page_club">
        <div className="unit-header unit-header_club">
          Клуб - {this.state.club.name}
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
            <div className="unit-info__text">{this.state.club.name}</div>
          </div>
          <div className="unit-info__label unit-info__label_phone">
            <div className="unit-info__name">Адрес</div>
            <div className="unit-info__text">{this.state.club.address}</div>
          </div>
          <div className="unit-info__label unit-info__label_creator">
            <div className="unit-info__name">Количество клиентов</div>
            <div className="unit-info__text">{this.state.club.clientsCount}</div>
          </div>
          <div className="unit-info__label unit-info__label_created">
            <div className="unit-info__name">Дата регистрации</div>
            <div className="unit-info__text">{moment(this.state.club.created).format('DD.MM.YYYY')}</div>
          </div>
        </div>
        {Boolean(this.state.club.promotions.length) &&
          <TableWithPagination 
            className="clubs"
            header={header}
            mappingFn={mappingFn}
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