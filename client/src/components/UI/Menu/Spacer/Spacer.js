import React from 'react';
import classNames from 'classnames';
import './Spacer.scss';

const MenuSpacer = ({ className }) => {
  const inputClass = classNames('menu__spacer', className);

  return (
    <div className={inputClass}></div>
  );
};

export default MenuSpacer;