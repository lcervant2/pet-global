import React from 'react';
import classNames from 'classnames';
import './Square.scss';

const ImageSquare = ({ className, src }) => {
  const inputClass = classNames('image-square', className);
  const containerClass = classNames('image-square__container');
  const imageClass = classNames('image-square__container__image');

  return (
    <div className={inputClass}>
      <div className={containerClass}>
        <div className={imageClass} style={{ backgroundImage: `url(${src})` }} />
      </div>
    </div>
  );
};

export default ImageSquare;