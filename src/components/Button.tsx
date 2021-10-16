import React, { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  // eslint-disable-next-line react/require-default-props
  isOutlined?: boolean
};

export function Button({ isOutlined = false, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`button ${isOutlined ? 'outlined' : ''}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
}
