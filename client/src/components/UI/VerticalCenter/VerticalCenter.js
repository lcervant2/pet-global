import React from 'react';
import classNames from 'classnames';
import './VerticalCenter.scss';

const VerticalCenter = ({ children, className }) => {
  const inputClass = classNames('vertical-center', className);
  const containerClass = classNames('vertical-center__container');

  return (
    <div className={inputClass}>
      <div className={containerClass}>
        {children}
      </div>
    </div>
  );
};

export default VerticalCenter;