import React, { useRef } from 'react';
import { Tooltip } from '@cognite/cogs.js';
import Highlighter from 'react-highlight-words';
import { useIsOverflow } from '../../../hooks';
import { EllipsisText } from '..';

export const HighlightCell = React.memo(
  ({
    text,
    query,
    lines = 2,
    className,
  }: {
    text?: string;
    query?: string;
    lines?: number;
    className?: string;
  }) => {
    const textWrapperRef = useRef<HTMLDivElement>(null);
    const isEllipsisActive = useIsOverflow(textWrapperRef);

    return (
      <EllipsisText level={2} lines={lines} className={className}>
        <div ref={textWrapperRef}>
          <Tooltip
            content={text}
            placement="top-start"
            arrow={false}
            interactive
            disabled={!isEllipsisActive}
          >
            <Highlighter
              searchWords={(query || '').split(' ')}
              textToHighlight={text || ''}
              autoEscape
            />
          </Tooltip>
        </div>
      </EllipsisText>
    );
  }
);