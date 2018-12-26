import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom'
import './Breadcrumbs.scss';

const schemas = {
  Agent: [
    { name: 'index', regexp: /^\/$/ },
    { name: 'club', regexp: /^\/club\/.{24}$/ },
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
      club: (id) => ({ text: `Клуб (${clubName})`, url: `/club/${id}` }),
      operators: (id) => ({ text: 'Управление операторами', url }),
      clients: (id) => ({ text: 'Управление клиентами', url: `/club/${id}/clients` }),
      client: (id) => ({ text: 'Клиент', url }),
    };

    if (page === 'index') {
      return [links.index];
    }
    if (page ==='club') {
      return [links.index, links.club(clubId)];
    }
    if (page === 'operators') {
      return [links.index, links.club(clubId), links.operators(clubId)];
    }
    if (page === 'clients') {
      return [links.index, links.club(clubId), links.clients(clubId)];
    }
    if (page === 'client') {
      return [links.index, links.club(clubId), links.clients(clubId), links.client(clubId)];
    }
    return [];
  }

  render() {
    const currentPage = this.parseURL(document.location.pathname);
    const links = this.getLinks(currentPage);
    return (
      <div className="breadcrumbs">
        {
          links.map(link => <NavLink exact to={link.url} className="breadcrumb" activeClassName="breadcrumb_active">{link.text}</NavLink>)
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