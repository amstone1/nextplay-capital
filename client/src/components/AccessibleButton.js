import React from 'react';
import PropTypes from 'prop-types';

const AccessibleButton = ({ 
  onClick, 
  disabled, 
  ariaLabel, 
  className, 
  type = 'button',
  children 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`accessible-button ${className}`}
      type={type}
    >
      {children}
    </button>
  );
};

AccessibleButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  children: PropTypes.node.isRequired
};

export default AccessibleButton;