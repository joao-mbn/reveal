import * as yup from 'yup';
import { SupportedScheduleStrings } from 'components/integrations/cols/Schedule';
import { CRON_REQUIRED, cronValidator } from 'utils/validation/cronValidation';

export const NAME_REQUIRED: Readonly<string> = 'Integration name is required';
export const MAX_DESC_LENGTH: Readonly<number> = 500;
export const MAX_DOCUMENTATION_LENGTH: Readonly<number> = 500;
const SCHEDULE_REQUIRED: Readonly<string> = 'Schedule is required';
export const nameRule = {
  name: yup.string().required(NAME_REQUIRED),
};
export const CONTACT_NAME_REQUIRED: Readonly<string> = 'Name is required';
export const contactNameRule = {
  name: yup.string().required(CONTACT_NAME_REQUIRED),
};
export const CONTACT_EMAIL_REQUIRED: Readonly<string> = 'Email is required';
export const emailRule = {
  email: yup.string().required(CONTACT_EMAIL_REQUIRED),
};
export const roleRule = {
  role: yup.string(),
};
export const sentNotificationRule = {
  sendNotification: yup.boolean(),
};
export const nameSchema = yup.object().shape(nameRule);
export const contactNameSchema = yup.object().shape(contactNameRule);
export const contactEmailSchema = yup.object().shape(emailRule);
export const contactRoleSchema = yup.object().shape(roleRule);
export const contactSendNotificationSchema = yup
  .object()
  .shape(sentNotificationRule);
export const contactSchema = yup.object().shape({
  ...contactNameRule,
  ...emailRule,
  ...roleRule,
  ...sentNotificationRule,
});

export const descriptionSchema = yup.object().shape({
  description: yup
    .string()
    .required('Description is required')
    .max(
      MAX_DESC_LENGTH,
      `Description can only contain ${MAX_DESC_LENGTH} characters`
    ),
});
export const scheduleSchema = yup.object().shape({
  schedule: yup.string().required(SCHEDULE_REQUIRED),
  cron: yup.string().when('schedule', {
    is: (val: SupportedScheduleStrings) =>
      val === SupportedScheduleStrings.SCHEDULED,
    then: yup
      .string()
      .required(CRON_REQUIRED)
      .test('cron-expression', 'Cron not valid', cronValidator),
  }),
});
export const documentationSchema = yup.object().shape({
  documentation: yup
    .string()
    .max(
      MAX_DOCUMENTATION_LENGTH,
      `Documentation can only contain ${MAX_DESC_LENGTH} characters`
    ),
});
