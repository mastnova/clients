import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './Tooltip.scss';

class Tooltip extends PureComponent {
  static defaultProps = {
    leftOffset: '-5px'
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <div className="tooltip">
        {this.props.children}
        <div className="tooltip__content" style={{marginLeft: this.props.leftOffset}}>{this.props.text}</div>
      </div>
    );
  }
}

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  leftOffset: PropTypes.string,
};

export default Tooltip;