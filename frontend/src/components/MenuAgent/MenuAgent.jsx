import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom'
import './MenuAgent.scss';

import Menu from '../UI/Menu/Menu';
import { PAGE_URL } from '../../constants';

class MenuAgent extends PureComponent {

  render() {
    return (
      <Menu>
        <NavLink exact to={PAGE_URL.index} activeClassName="menu-tab_active" className="menu-tab menu-tab_icon-club"><span>Управление клубами</span></NavLink>
        {
          this.props.match.params.id
            ? <NavLink exact to={'/club/' + this.props.match.params.id + '/operators'} activeClassName="menu-tab_active" className="menu-tab menu-tab_icon-ops"><span>Управление операторами</span></NavLink>
            : <div className="menu-tab menu-tab_icon-ops menu-tab_disabled"><span>Управление операторами</span></div>
        }
        {
          this.props.match.params.id
            ? <NavLink exact to={'/club/' + this.props.match.params.id + '/clients'} activeClassName="menu-tab_active" className="menu-tab menu-tab_icon-ops"><span>Управление клиентами</span></NavLink>
            : <div className="menu-tab menu-tab_icon-ops menu-tab_disabled"><span>Управление клиентами</span></div>
        }
      </Menu>
    );
  }
}

export default MenuAgent;