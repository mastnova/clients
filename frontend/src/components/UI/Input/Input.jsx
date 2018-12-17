import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Input.scss';

import { isValid as isInputValid } from '../../../utils/validation';

class Input extends PureComponent {
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
      isActivated: false,
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

  onBlur = () => {
    this.setState({isActivated: true});
  }

  render() {
    const cn = classNames(
      'input', 
      {'input__error': !this.state.isValid && this.state.isActivated},
      { 'input__success': this.state.isValid && this.state.isActivated},
      );
    return (
      <input
        className={cn}
        name={this.props.name}
        onChange={this.onChange}
        onBlur={this.onBlur}
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