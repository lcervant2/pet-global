import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Panel.scss';

const Panel = ({ children, className, padded, noPadding }) => {
  if (children.constructor !== Array)
    children = [children];

  // find the headers/footers
  let header = null;
  let footer = null;
  children.forEach(child => {
    if (child.type) {
      if (child.type.displayName === 'PanelHeader')
        header = child;
      else if (child.type.displayName === 'PanelFooter')
        footer = child;
    }
  });

  // filter out header and footer
  children = children.filter(child => child !== header && child !== footer);

  const inputClass = classNames('panel', {
    'panel--border-top': !header,
    'panel--border-bottom': !footer,
    'panel--extra-padding': padded,
    'panel--no-padding': noPadding
  }, className);

  const contentClass = classNames('panel__content');

  return (
    <div className={inputClass}>
      {header}
      <div className={contentClass}>{children}</div>
      {footer}
    </div>
  );
};

export default Panel;