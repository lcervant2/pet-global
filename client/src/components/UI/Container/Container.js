import React from 'react';
import classNames from 'classnames';
import './Container.scss';

const Container = ({ children, className }) => {
  const inputClass = classNames('container', className);

  return (
    <div className={inputClass}>
      {children}
    </div>
  );
};

export default Container;