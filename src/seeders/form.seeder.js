import * as formModel from '../models/Form.js';
import * as eventModel from '../models/Event.js';

export default async () => {
  const events = await eventModel.getEvents();

  const dummyContentFormJson = [
      {
        "id": "fullName",
        "label": "Nama Lengkap",
        "type": "text",
        "required": true
      },
      {
        "id": "emailAddress",
        "label": "Email",
        "type": "email",
        "required": true
      },
      {
        "id": "phoneNumber",
        "label": "Nomor Telepon",
        "type": "tel",
        "required": true
      },
      {
        "id": "institution",
        "label": "Institusi",
        "type": "text",
        "required": true
      },
      {
        "id": "expectation",
        "label": "Harapan dari Workshop",
        "type": "textarea",
        "required": false
      }
    ];
  const formData = events.map((event, _index) => ({
    eventId: event.id,
    content: dummyContentFormJson,
    createdAt: new Date()
  }));

  await formModel.createForms(formData);
}