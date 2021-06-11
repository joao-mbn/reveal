import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createLink } from '@cognite/cdf-utilities';
import { RegisterIntegrationLayout } from 'components/layout/RegisterIntegrationLayout';
import { ButtonPlaced } from 'styles/StyledButton';
import { EXT_PIPE_NAME_HEADING, NAME_HINT, NEXT } from 'utils/constants';
import { CreateFormWrapper } from 'styles/StyledForm';
import { EXTERNAL_ID_PAGE_PATH } from 'routing/CreateRouteConfig';
import { useStoredRegisterIntegration } from 'hooks/useStoredRegisterIntegration';
import { TaskList, taskListItems } from 'pages/create/TaskList';
import { FullInput } from 'components/inputs/FullInput';
import { nameSchema } from 'utils/validation/integrationSchemas';
import { HeadingLabel } from 'components/inputs/HeadingLabel';

interface NamePageProps {}

interface NameFormInput {
  name: string;
}
const NamePage: FunctionComponent<NamePageProps> = () => {
  const history = useHistory();
  const {
    storedIntegration,
    setStoredIntegration,
  } = useStoredRegisterIntegration();
  const { control, handleSubmit, errors } = useForm<NameFormInput>({
    resolver: yupResolver(nameSchema),
    defaultValues: {
      name: storedIntegration?.name,
    },
    reValidateMode: 'onSubmit',
  });

  const handleNext = (field: NameFormInput) => {
    setStoredIntegration({ ...storedIntegration, ...field });
    history.push(createLink(EXTERNAL_ID_PAGE_PATH));
  };
  return (
    <RegisterIntegrationLayout>
      <CreateFormWrapper onSubmit={handleSubmit(handleNext)}>
        <FullInput
          name="name"
          inputId="integration-name"
          defaultValue=""
          control={control}
          errors={errors}
          labelText={EXT_PIPE_NAME_HEADING}
          hintText={NAME_HINT}
          renderLabel={(labelText, inputId) => (
            <HeadingLabel labelFor={inputId}>{labelText}</HeadingLabel>
          )}
        />
        <ButtonPlaced type="primary" htmlType="submit">
          {NEXT}
        </ButtonPlaced>
      </CreateFormWrapper>
      <TaskList list={taskListItems} />
    </RegisterIntegrationLayout>
  );
};
export default NamePage;
