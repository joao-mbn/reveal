import React, { useContext } from 'react';
import { Button, Loader } from '@cognite/cogs.js';
import { UserContext } from '@cognite/cdf-utilities';
import styled from 'styled-components';

const Home = () => {
  const user = useContext(UserContext);
  return (
    <>
      <Loader />
      <Container>
        <p>Your Unified UI Subapp is now running! Congrats {user.username}!</p>
        <Button type="primary">My first Cog.js button</Button>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default Home;
