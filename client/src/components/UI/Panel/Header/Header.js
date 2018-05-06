import React from 'react';
import classNames from 'classnames';
import './Header.scss';

const PanelHeader = ({ className, title, content }) => {
  const inputClass = classNames('panel__header', className);
  const titleClass = classNames('panel__header__title');
  const contentClass = classNames('panel__header__content');

  return (
    <div className={inputClass}>
      {title && <div className={titleClass}>{title}</div>}
      {content && <div className={contentClass}>{content}</div>}
    </div>
  );
};

PanelHeader.displayName = 'PanelHeader';

export default PanelHeader;