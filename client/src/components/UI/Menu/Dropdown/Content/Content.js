import React, { Component } from 'react';
import classNames from 'classnames';
import './Content.scss';

class MenuDropdownContent extends Component {

  render() {
    const { children, className } = this.props;

    const inputClass = classNames('menu__dropdown__content', className);

    return (
      <div className={inputClass}>
        {children}
      </div>
    );
  }

}

MenuDropdownContent.displayName = 'MenuDropdownContent';

export default MenuDropdownContent;