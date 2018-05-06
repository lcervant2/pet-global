import React from 'react';
import classNames from 'classnames';
import './Menu.scss';

import ClearFloat from '../ClearFloat/ClearFloat';

const Menu = ({ children, className, compact, centered }) => {
  const inputClass = classNames('menu',{
    'menu--compact': compact,
    'menu--centered': centered
  }, className);

  return (
    <div className={inputClass}>
      {children}
      <ClearFloat />
    </div>
  );
};

export default Menu;