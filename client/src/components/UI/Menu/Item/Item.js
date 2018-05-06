import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import './Item.scss';

const MenuItem = ({ children, linkTo, className, noHover, light, expand, padded }) => {
  const inputClass = classNames(
    'menu__item',
    {
      'menu__item--router-link': linkTo && !noHover,
      'menu__item--light': light,
      'menu__item--expand': expand,
      'menu__item--padded': padded
    },
    className);

  if (linkTo){
    return (
      <Link to={linkTo} className={inputClass}>
        {children}
      </Link>
    );
  } else {
    return (
      <div className={inputClass}>
        {children}
      </div>
    );
  }
};

export default MenuItem;