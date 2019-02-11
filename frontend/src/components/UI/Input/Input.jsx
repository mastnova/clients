import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import InputMask from 'react-input-mask';
import './Input.scss';

import { validate } from '../../../utils/validation';

class Input extends PureComponent {
  static defaultProps = {
    name: 'input',
    type: 'text',
    value: '',
    defaultValue: '',
    placeholder: '',
    onChange: () => { },
  }

  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
      error: '',
      isActivated: false,
      errorIsHidden: true,
    };
  }
  
  componentDidMount() {
    this.input.value = this.props.defaultValue;
  }

  onChange = () => {
    const value = this.input.value;
    const comparingValue = this.props.compareWith;
    let {isValid, error} = validate(value, this.props.validationType);
    if (comparingValue) {
      if (value !== comparingValue) {
        isValid = false;
        error = 'Поля не совпадают';
      }
    }
    this.setState({ isValid, error });
    this.props.onChange({
      name: this.props.name,
      value,
      isValid,
    })
  }

  onBlur = () => {
    this.setState({isActivated: true, errorIsHidden: true});
  }

  onFocus = () => {
    if (this.state.isActivated) {
      this.setState({ errorIsHidden: false });
    } else {
      this.onChange();
    }
  }

  shouldShowError = () => {
    return !!this.props.validationType && !this.state.isValid && !this.state.errorIsHidden
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
          placeholder={this.props.placeholder}
          alwaysShowMask
          inputRef={(el) => { this.input = el }}
        />
      
      :<input
        className={cn}
        type={this.props.type}
        name={this.props.name}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        value={this.props.value}
        placeholder={this.props.placeholder}
        ref={(el) => {this.input = el}}
      />
      }
        {this.shouldShowError() && <div className="input__message">{this.state.error}</div>}
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
  defaultValue: PropTypes.string,
};

export default Input;