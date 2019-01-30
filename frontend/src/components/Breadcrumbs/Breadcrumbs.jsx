import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom'
import './Breadcrumbs.scss';

const schemas = {
  Agent: [
    { name: 'index', regexp: /^\/$/ },
    { name: 'club', regexp: /^\/club\/.{24}$/ },
    { name: 'clubs', regexp: /^\/clubs\/.{24}$/ },
    { name: 'clubsRemoved', regexp: /^\/clubs\/.{24}\/removed$/ },
    { name: 'clubsAll', regexp: /^\/clubs\/all$/ },
    { name: 'clubsAllRemoved', regexp: /^\/clubs\/removed$/ },
    { name: 'clients', regexp: /^\/club\/.{24}\/clients$/ },
    { name: 'client', regexp: /^\/club\/.{24}\/clients\/.{24}$/ },
    { name: 'operators', regexp: /^\/club\/.{24}\/operators$/ },
  ]
}

class Breadcrumbs extends PureComponent {
  parseURL = (url) => {
    let clubId = null;
    if ( /^\/club\//.test(url) ) {
      clubId = url.substr(6, 24);
      this.props.setClubId(clubId);
    }
    
    const page = schemas.Agent.find( page => page.regexp.test(url)) || {};
    return { page: page.name, clubId, url };
  }

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
    if (page === 'operators') {
      return [links.index, links.club(clubId), links.operators(clubId)];
    }
    if (page === 'clients') {
      return [links.index, links.club(clubId)];
    }
    if (page === 'client') {
      return [links.index, links.club(clubId), links.client(clubId)];
    }
    return [];
  }

  render() {
    const currentPage = this.parseURL(document.location.pathname);
    const links = this.getLinks(currentPage);
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
}

export default Breadcrumbs;