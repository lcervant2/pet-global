import React from 'react';
import classNames from 'classnames';
import './Footer.scss';

const PanelFooter = ({ className, content }) => {
  const inputClass = classNames('panel__footer', className);
  const contentClass = classNames('panel__footer__content');

  return (
    <div className={inputClass}>
      {content && <div className={contentClass}>{content}</div>}
    </div>
  );
};

PanelFooter.displayName = 'PanelFooter';

export default PanelFooter;