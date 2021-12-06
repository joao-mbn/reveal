import { default as DateIcon } from './DateIcon.svg';
import { default as DocumentIcon } from './DocumentIcon.svg';
import { default as DocumentIconDisabled } from './DocumentIconDisabled.svg';
import { default as DocumentIconHover } from './DocumentIconHover.svg';
import { default as EmptyStateArrowIcon } from './EmptyStateArrowIcon.svg';
import { default as KeyIcon } from './KeyIcon.svg';
import { default as UnknownPrimaryKeyIcon } from './UnknownPrimaryKeyIcon.svg';

const icons = {
  DateIcon,
  DocumentIcon,
  DocumentIconDisabled,
  DocumentIconHover,
  EmptyStateArrowIcon,
  KeyIcon,
  UnknownPrimaryKeyIcon,
};

export type IconType = keyof typeof icons;

export default icons;
