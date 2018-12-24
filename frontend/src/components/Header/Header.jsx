import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './Header.scss';

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentWillMount() {
    
  }

  render() {
    return (
      <div className="header">
      this is fuckin awesome header!
      </div>
    );
  }
}

Header.propTypes = {
  
};

export default Header;