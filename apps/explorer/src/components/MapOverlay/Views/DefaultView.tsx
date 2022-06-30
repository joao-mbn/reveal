import { AvatarButton } from 'components/AvatarButton';
import { AbsoluteHeader } from 'components/Header';
import { NavigateToSearchButton } from 'components/SearchBar';
import { PAGES } from 'pages/routers/constants';
import { Link } from 'react-router-dom';

export const DefaultView = () => (
  <AbsoluteHeader>
    <AbsoluteHeader.Left>
      <NavigateToSearchButton />
    </AbsoluteHeader.Left>
    <Link to={PAGES.PROFILE}>
      <AvatarButton />
    </Link>
  </AbsoluteHeader>
);
