/*!
 * Copyright 2024 Cognite AS
 */

import isNil from 'lodash/isNil';

export function isEmpty(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.length === 0;
}

export function equalsIgnoreCase(value1: string, value2: string): boolean {
  return value1.toLowerCase() === value2.toLowerCase();
}

export function cocatinate(name: string, value?: any): string {
  if (isNil(value)) return `, ${name}`;
  return `, ${name}: ${value}`;
}

export function isNumber(text: string): boolean {
  const value = Number(text);
  return !Number.isNaN(value);
}

export function getNumber(text: string): number {
  const value = Number(text);
  if (Number.isNaN(value)) {
    return Number.NaN;
  }
  return value;
}