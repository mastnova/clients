import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import InputMask from 'react-input-mask';
import './Input.scss';

import { isValid as isInputValid } from '../../../utils/validation';

class Input extends PureComponent {
  static defaultProps = {
    name: 'input',
    type: 'text',
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

  onChange = () => {
    const value = this.input.value;
    const comparingValue = this.props.compareWith;
    let isValid = isInputValid(value, this.props.validationType);
    if (comparingValue) {
      isValid = value === comparingValue ? isValid : false
    }
    this.setState({isValid});
    this.props.onChange({
      name: this.props.name,
      value,
      isValid,
    })
  }

  onBlur = () => {
    this.setState({isActivated: true});
  }

  render() {
    this.props.compareWith && this.onChange();
    const cn = classNames(
      'input',
      {'input__error': !this.state.isValid && this.state.isActivated},
      { 'input__success': this.state.isValid && this.state.isActivated},
    );
    return (
      <div className={this.props.icon ? `input-wrapper input-wrapper_${this.props.icon}`: null}>
      {
        this.props.mask ?
        <InputMask
          className={cn}
          onChange={this.onChange}
          onBlur={this.onBlur}
          value={this.props.value}
          mask={this.props.mask}
          alwaysShowMask
          inputRef={(el) => { this.input = el }}
        />
      
      :<input
        className={cn}
        type={this.props.type}
        name={this.props.name}
        onChange={this.onChange}
        onBlur={this.onBlur}
        value={this.props.value}
        placeholder={this.props.placeholder}
        ref={(el) => {this.input = el}}
      />
      }
      </div>
    );
  }
}

Input.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  validationType: PropTypes.string,
  compareWith: PropTypes.string,
};

export default Input;