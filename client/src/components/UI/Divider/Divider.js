import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Divider.scss';

const Divider = ({ className, content }) => {
  const inputClass = classNames('divider', className);
  const horizontalRuleClass = classNames('divider__hr');
  const contentClass = classNames('divider__content');

  return (
    <div className={inputClass}>
      <div className={horizontalRuleClass} />
      {content && <div className={contentClass}>{content}</div>}
      <div className={horizontalRuleClass} />
    </div>
  );
};

Divider.propTypes = {
  content: PropTypes.string
};

Divider.defaultProps = {
  content: null
};

export default Divider;