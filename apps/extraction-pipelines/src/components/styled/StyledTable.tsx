import React from 'react';

import styled from 'styled-components';

import { Colors } from '@cognite/cogs.js';

export const StyledTable = styled.div`
  .cogs-table {
    border-spacing: 0;
    border-collapse: collapse;
    thead {
      tr {
        border-bottom: ${Colors['decorative--grayscale--300']};
        th {
          background-color: white;
          padding: 1rem 0.75rem;
          white-space: nowrap;
        }
      }
    }
    tbody {
      tr {
        .timestamp-col {
          font-weight: bold;
        }
        &.parent-row {
          .statusSeen-col {
            position: relative;
            .cogs-icon {
              position: absolute;
              right: 0;
              top: 0.9375rem;
            }
          }
        }
        &.seen-status-row {
          .timestamp-col {
            font-weight: normal;
            padding-left: 1.5rem;
          }
        }
        td {
          padding: 0.75rem;
          &.timestamp-col {
            border-bottom: 0.0625rem solid
              ${Colors['decorative--grayscale--300']};
          }
        }
      }
      th:first-child.timestamp-col {
        width: 11rem;
      }
      .status-col,
      .statusSeen-col {
        text-align: center;
      }
    }
  }
`;

export const StyledTableNoRowColor = styled((props) => (
  <StyledTable {...props}>{props.children}</StyledTable>
))`
  .cogs-table {
    thead {
      tr {
        th {
          background-color: white;
        }
      }
    }
    tbody {
      tr {
        &:hover,
        &:nth-child(2n):hover {
          background-color: ${Colors['decorative--blue--700']};
          cursor: pointer;
        }
        &:nth-child(2n) {
          background-color: white;
        }
        &.row-active {
          background-color: ${Colors['decorative--blue--700']};
          &:hover {
            background-color: ${Colors['decorative--grayscale--200']};
          }
        }
      }
    }
  }
`;

export const StyledTableNoRowColor2 = styled((props) => (
  <StyledTable {...props}>{props.children}</StyledTable>
))`
  .cogs-table {
    thead,
    tbody {
      tr {
        &:hover,
        &:nth-child(2n):hover {
          background-color: unset;
          cursor: auto;
        }
        &:nth-child(2n) {
          background-color: white;
        }
      }
    }
    tbody td {
      text-align: center;
    }
  }
`;
export default StyledTableNoRowColor;