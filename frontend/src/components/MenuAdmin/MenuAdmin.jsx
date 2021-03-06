import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom'

import Menu from '../UI/Menu/Menu';
import { PAGE_URL } from '../../constants';

class MenuAdmin extends PureComponent {

  render() {
    return (
      <Menu>
        <NavLink exact to={PAGE_URL.index} activeClassName="menu-tab_active" className="menu-tab menu-tab_icon-agent"><span>Агенты</span></NavLink>
        <NavLink exact to={`${PAGE_URL.clubs}/all`} activeClassName="menu-tab_active" className="menu-tab menu-tab_icon-club"><span>Клубы</span></NavLink>
        {
          this.props.match.params.id
            ? <NavLink exact to={`${PAGE_URL.club}/${this.props.match.params.id}${PAGE_URL.clients}`} activeClassName="menu-tab_active" className="menu-tab menu-tab_icon-client"><span>Клиенты</span></NavLink>
            : <a className="menu-tab menu-tab_icon-client menu-tab_disabled"><span>Клиенты</span></a>
        }
        {
          this.props.match.params.id
            ? <NavLink exact to={`${PAGE_URL.club}/${this.props.match.params.id}${PAGE_URL.operators}`} activeClassName="menu-tab_active" className="menu-tab menu-tab_icon-ops"><span>Операторы</span></NavLink>
            : <a className="menu-tab menu-tab_icon-ops menu-tab_disabled"><span>Операторы</span></a>
        }
        {
          this.props.match.params.id
            ? <NavLink exact to={`${PAGE_URL.club}/${this.props.match.params.id}`} activeClassName="menu-tab_active" className="menu-tab menu-tab_icon-promo"><span>Акции</span></NavLink>
            : <a className="menu-tab menu-tab_icon-promo menu-tab_disabled"><span>Акции</span></a>
        }
        
      </Menu>
    );
  }
}

export default MenuAdmin;