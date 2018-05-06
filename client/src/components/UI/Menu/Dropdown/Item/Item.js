import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import './Item.scss';

const MenuDropdownItem = ({ children, className, linkTo, onClick }) => {
  const inputClass = classNames('menu__dropdown__item', className);

  if (linkTo) {
    return (
      <Link to={linkTo} onClick={onClick} className={inputClass}>
        {children}
      </Link>
    );
  } else {
    return (
      <div onClick={onClick} className={inputClass}>
        {children}
      </div>
    );
  }
};

export default MenuDropdownItem;