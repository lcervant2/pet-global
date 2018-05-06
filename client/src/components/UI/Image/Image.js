import React from 'react';
import classNames from 'classnames';
import './Image.scss';

const Image = ({ src, className, avatar }) => {
  const inputClass = classNames('image', {
    'image--avatar': avatar
  }, className);

  return (
    <img src={src} className={inputClass} />
  )
};

export default Image;