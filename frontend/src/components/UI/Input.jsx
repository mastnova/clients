import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { isValid as isInputValid } from '../../utils/validation';

class Input extends Component {
  static defaultProps = {
    name: 'input',
    value: '',
    placeholder: '',
    onChange: () => { },
  }

  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
    };
  }

  onChange = ({target}) => {
    const comparingValue = this.props.compareWith;
    let isValid = isInputValid(target.value, this.props.validationType);
    if (comparingValue) {
      isValid = target.value === comparingValue ? isValid : false
    }
    this.setState({isValid});
    this.props.onChange({
      name: this.props.name,
      value: target.value,
      isValid,
    })
  }

  render() {
    const cn = classNames(
      'input', 
      {'input__error': !this.state.isValid},
      {'input__success': this.state.isValid},
      );
    return (
      <input
        className={cn}
        name={this.props.name}
        onChange={this.onChange}
        value={this.props.value}
        placeholder={this.props.placeholder}
      />
    );
  }
}

Input.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  validationType: PropTypes.string,
  compareWith: PropTypes.string,
};

export default Input;