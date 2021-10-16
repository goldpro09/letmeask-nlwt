/* eslint-disable react/require-default-props */
import React, { ReactNode } from 'react';
import { usePalette } from 'react-palette';
import cx from 'classnames';
import './styles.scss';

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Question({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  children,
}: QuestionProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = usePalette(author.avatar as string);

  return (
    <div className={cx('question', { answered: isAnswered }, { highlighted: isHighlighted && !isAnswered }, 'entrance')}>
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} style={{ color: data.vibrant }} />
          <span style={{ color: data.vibrant }}>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  );
}
