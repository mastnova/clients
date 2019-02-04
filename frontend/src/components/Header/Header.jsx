import React, { PureComponent } from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Header.scss';

class Header extends PureComponent {

  render() {
    const {role, avatar} = this.props;
    const avaClass = cn(
      'header__avatar',
      `header__avatar_${avatar}`,
      {
        'header__avatar_operator': role === 'operator',
        'header__avatar_agent': role === 'agent',
        'header__avatar_admin': role === 'root',
      }
    );
    return (
      <div className="header">
        <div className="header__content">
          <Link to={'/'} className="header__logo">
            <div className="header__pic" />
            <div className="header__title">SlotAdmin<span>Система учета клиентов</span></div>
          </Link>
          <div className="header__user">
            <span className="header__username">{this.props.name}</span>
            <div className={avaClass}/>
            <div className="header__exit" onClick={this.props.onLogout}/>
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  role: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
  avatar: PropTypes.number.isRequired,
};

export default Header;