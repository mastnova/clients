import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom'
import './Breadcrumbs.scss';

import { parseURL } from '../../utils/url';

class Breadcrumbs extends PureComponent {

  getLinks = ({page, clubId, url}) => {
    const clubName = this.props.clubName;
    const links = {
      index: { text: 'Главная', url: '/' },
      club: (id) => ({ text: `Клуб ${clubName}`, url: `/club/${id}/clients` }),
      clubs: { text: `Клубы агента`, url },
      clubsRemoved: { text: `Удаленные клубы агента`, url },
      clubsAll: { text: `Клубы`, url },
      clubsAllRemoved: { text: `Удаленные клубы`, url },
      operators: (id) => ({ text: 'Управление операторами', url }),
      clients: (id) => ({ text: 'Управление клиентами', url: `/club/${id}/clients` }),
      client: (id) => ({ text: 'Клиент', url }),
      promo: { text: `Акции клуба`, url },
      singlePromo: { text: `Просмотр акции`, url },
      promoLink: (id) => ({ text: 'Акции клуба', url: `/club/${id}` }),
      agent: (clubId) => {
        const agentId = this.props.getClubOwner(clubId);
        return { text: `Клубы агента`, url: `/clubs/${agentId}` }
      },
    };

    if (page === 'index') {
      return [links.index];
    }
    if (page === 'clubsAll') {
      return [links.index, links.clubsAll];
    }
    if (page === 'clubsAllRemoved') {
      return [links.index, links.clubsAllRemoved];
    }
    if (page ==='clubs') {
      return [links.index, links.clubs];
    }
    if (page === 'clubsRemoved') {
      return [links.index, links.clubsRemoved];
    }
    if (page === 'club') {
      return [links.index, links.club(clubId), links.promo];
    }
    if (page === 'promotion') {
      return [links.index, links.club(clubId), links.promoLink(clubId), links.singlePromo];
    }
    if (page === 'operators') {
      return [links.index, links.club(clubId), links.operators(clubId)];
    }
    if (page === 'clients' && this.props.user === 'agent') {
      return [links.index, links.club(clubId)];
    }
    if (page === 'clients' && this.props.user === 'admin') {
      return [links.index, links.agent(clubId), links.club(clubId)];
    }
    if (page === 'client') {
      return [links.index, links.club(clubId), links.client(clubId)];
    }
    return [];
  }

  render() {
    const currentPage = parseURL(document.location.pathname);
    const links = this.getLinks(currentPage);
    if (currentPage.clubId) {
      this.props.setClubId(currentPage.clubId);
    }
    return (
      <div className="breadcrumbs">
        {
          links.map((link, i) => <NavLink exact to={link.url} key={i} className="breadcrumb" activeClassName="breadcrumb_active">{link.text}</NavLink>)
        }
      </div>
    );
  }
}

Breadcrumbs.propTypes = {
  setClubId: PropTypes.func.isRequired,
  clubName: PropTypes.string.isRequired,
  user: PropTypes.oneOf(['admin', 'agent']),
  getClubOwner: PropTypes.func,
}

export default Breadcrumbs;