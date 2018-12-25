import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './MenuOperator.scss';

import Menu from '../UI/Menu/Menu';

class MenuOperator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <Menu><span className="menu-operator__text">Добавить клиента</span></Menu>
    );
  }
}

MenuOperator.propTypes = {
  
};

export default MenuOperator;