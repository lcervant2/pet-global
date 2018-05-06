import React from 'react';
import classNames from 'classnames';
import './List.scss';

const List = ({ children, className }) => {
  const inputClass = classNames('list', className);

  return (
    <div className={inputClass}>
      {children}
    </div>
  );
};

export default List;