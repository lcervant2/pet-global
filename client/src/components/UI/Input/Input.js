import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Input.scss';

import Icon from '../Icon/Icon';

class Input extends Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.inputRef = React.createRef();

    this.state = {
      focused: false
    };
  }

  handleClick(e) {
    // focus the input
    this.inputRef.current.focus();

    e.preventDefault();
  }

  onFocus() {
    this.setState({ focused: true });
  }

  onBlur() {
    this.setState({ focused: false });
  }

  handleChange(e) {
    this.props.onChange(e, { name: e.target.name, value: e.target.value });
  }

  render() {
    const { className, type, name, placeholder, icon, action, value } = this.props;
    const { focused } = this.state;

    const inputClass = classNames('input', className);
    const inputContainerClass = classNames('input__container', {
      'input__container--show-focus': focused,
      'input__container--show-icon': icon,
      'input__container--right-attachment': action
    });
    const inputPlaceholderClass = classNames('input__input');
    const iconClass = classNames('input__icon');
    const actionClass = classNames({
      'button--left-attachment': action
    });

    return (
      <div className={inputClass} onClick={this.handleClick}>
        <div className={inputContainerClass}>
          {icon && <Icon className={iconClass} name={icon} />}
          <input
            ref={this.inputRef}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.handleChange}
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            className={inputPlaceholderClass} />
        </div>
        {action && React.cloneElement(action, { className: actionClass })}
      </div>
    );
  }

}

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  action: PropTypes.element,
  onChange: PropTypes.func
};

Input.defaultProps = {
  type: 'text',
  name: null,
  placeholder: null,
  icon: null,
  action: null,
  onChange: () => {}
};

export default Input;