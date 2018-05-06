import React from 'react';
import classNames from 'classnames';
import './Item.scss';

const ListItem = ({ children, className }) => {
  const inputClass = classNames('list__item', className);

  return (
    <div className={inputClass}>
      {children}
    </div>
  );
};

export default ListItem;