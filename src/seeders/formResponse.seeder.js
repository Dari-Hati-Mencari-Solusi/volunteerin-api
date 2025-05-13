import { fakerID } from './seederConfig.js';
import * as formModel from '../models/Form.js';
import * as userModel from '../models/User.js';
import * as formResponseModel from '../models/FormResponse.js';

export default async () => {
  const forms = await formModel.getAllForms();
  const users = (await userModel.getUsersOriginal()).filter(
    (user) => user.role === 'VOLUNTEER',
  );

  const formResponseData = forms
    .map((form, _index) => {
      return users.map((user) => ({
        userId: user.id,
        formId: form.id,
        answers: {
          fullName: fakerID.person.fullName(),
          expectation: 'Semoga tersemogakan',
          institution: 'Universitas Amikom Yogyakarta',
          phoneNumber: '087666555444333',
          emailAddress: fakerID.internet.email({ provider: 'gmail.com' }),
        },
        submittedAt: new Date(),
      }));
    })
    .flat();

  await formResponseModel.createFormResponses(formResponseData);
};
