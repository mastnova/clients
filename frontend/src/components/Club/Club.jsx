import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './Club.scss';

import Table from '../UI/Table/Table';
import Tooltip from '../UI/Tooltip/Tooltip';
import Pagination from '../UI/Pagination/Pagination';
import API from '../../API';

const header = ['#', 'Акция', 'Описание', 'Дата добавления'];

class Club extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      club: {
        promotions: []
      },
      rowsPerPage: 1,
      currentPage: 1,
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

  onChangePage = (currentPage) => {
    this.setState({ currentPage });
  }

  filterByPage = (promos) => {
    const start = (this.state.currentPage - 1) * this.state.rowsPerPage;
    const end = start + this.state.rowsPerPage;
    return promos.slice(start, end)
  }

  render() {
    const id = this.props.match.params.id;
    const filteredPromotions = this.filterByPage(this.state.club.promotions);
    return (
      <div className="page page_club">
        <div className="unit-header unit-header_club">
          Клуб - {this.state.club.name}
          <div className="unit-header__remove">
            <Tooltip text='Удалить' leftOffset='12px'>
              <div onClick={this.removeClub(this.state.club.id)} className="button-remove button-remove_big" />
            </Tooltip>
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
        {Boolean(filteredPromotions.length) &&
          <Table className="clubs">
            <Table.Header>{header}</Table.Header>
            {
              filteredPromotions.map((promo, i) => (
                <Table.Row key={promo.id}>
                  {[
                    i + 1,
                    promo.name,
                    promo.description,
                    moment(promo.created).format('DD.MM.YYYY')
                  ]}
                </Table.Row>
              ))
            }
          </Table>
        }
        {this.state.club.promotions.length > this.state.rowsPerPage &&
          <Pagination
            pagesCount={Math.ceil(this.state.club.promotions.length / this.state.rowsPerPage)}
            currentPage={this.state.currentPage}
            onChange={this.onChangePage}
          />
        }
        <div className="button-wrapper">
          <button className="button" type="button" onClick={this.onAddPromo}>
            <span className="button_add">Создать акцию</span>
          </button>
        </div>
      </div>
    );
  }
}

Club.propTypes = {

};

export default Club;