import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Dropdown.scss';

class Dropdown extends Component {

  render() {
    const { className } = this.props;

    const inputClass = classNames('dropdown', className);

    return (
      <div className={inputClass}>

      </div>
    );
  }

}

Dropdown.propTypes = {
  options: PropTypes.object
};

Dropdown.defaultProps = {
  options: {}
};

export default Dropdown;