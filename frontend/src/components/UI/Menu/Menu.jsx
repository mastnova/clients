import React from 'react';
import PropTypes from 'prop-types';
import './Menu.scss';

function Menu({children}) {
  return (
    <div className="menu">
      <div className="menu__content">{children}</div>
    </div>
  );
}

Menu.propTypes = {
  
};

export default Menu;