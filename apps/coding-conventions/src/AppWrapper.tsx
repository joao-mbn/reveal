import { loginAndAuthIfNeeded } from '@cognite/cdf-sdk-singleton';
import {
  SubAppWrapper,
  AuthWrapper,
  getEnv,
  getProject,
} from '@cognite/cdf-utilities';
import './set-public-path';
import App from './app/App';

export const AppWrapper = () => {
  const projectName = 'coding-conventions';
  const project = getProject();
  const env = getEnv();

  return (
    <AuthWrapper login={() => loginAndAuthIfNeeded(project, env)}>
      <SubAppWrapper title={projectName}>
        <App />
      </SubAppWrapper>
    </AuthWrapper>
  );
};
