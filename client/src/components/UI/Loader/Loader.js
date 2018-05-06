import React from 'react';
import classNames from 'classnames';
import './Loader.scss';

const Loader = ({ className }) => {
  const inputClass = classNames('loader', className);

  return (
    <div className={inputClass}>
      <i className='fa fa-circle-notch fa-spin'></i>
    </div>
  );
};

export default Loader;