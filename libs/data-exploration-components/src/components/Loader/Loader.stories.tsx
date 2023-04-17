import React from 'react';
import { Loader } from './Loader';

export default { title: 'Component/Loader', component: Loader };
export const Simple = () => (
  <div style={{ padding: '40px', background: 'grey' }}>
    <Loader />
  </div>
);