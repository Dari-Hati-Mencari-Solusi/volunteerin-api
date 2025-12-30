import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { Roles } from '../../constants/roles.js';

const mockJwt = {
  verify: jest.fn(),
  JsonWebTokenError: class {},
  TokenExpiredError: class {},
};
const mockUserModel = {
  getUserById: jest.fn(),
};
const mockFormResponseModel = {
  getEventRegistrationByUserId: jest.fn(),
  getFormResponseByFormIdAndUserId: jest.fn(),
  createFormResponse: jest.fn(),
};
const mockFormModel = {
  getFormsByEventId: jest.fn(),
};
const mockEventModel = {
  getEventById: jest.fn(),
};

jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));
jest.unstable_mockModule('../../models/User.js', () => mockUserModel);
jest.unstable_mockModule(
  '../../models/FormResponse.js',
  () => mockFormResponseModel,
);
jest.unstable_mockModule('../../models/Form.js', () => mockFormModel);
jest.unstable_mockModule('../../models/Event.js', () => mockEventModel);
jest.unstable_mockModule('imagekit', () => {
  return {
    default: class {
      constructor() {
        return {
          upload: jest
            .fn()
            .mockResolvedValue({ url: 'http://dummy-url.com/image.jpg' }),
          deleteFile: jest.fn(),
          url: jest.fn(),
        };
      }
    },
  };
});

const { getUserById } = await import('../../models/User.js');
const { getEventById } = await import('../../models/Event.js');
const { getFormsByEventId } = await import('../../models/Form.js');
const {
  getEventRegistrationByUserId,
  getFormResponseByFormIdAndUserId,
  createFormResponse,
} = await import('../../models/FormResponse.js');
const jwt = (await import('jsonwebtoken')).default;

const { default: eventRoute } = await import('../../routes/event.route.js');

const app = express();
app.use(express.json());
eventRoute(app);

describe('Integration Test [Role Volunteer]: Event Routes', () => {
  describe('GET /events/histories', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      process.env.JWT_SECRET_KEY = 'test-secret';
    });

    test('Skenario 1: Harus return 403 jika Role user bukan VOLUNTEER', async () => {
      jwt.verify.mockReturnValue({
        id: 'user-partner-id',
        role: Roles.PARTNER,
      });

      getUserById.mockResolvedValue({
        id: 'user-partner-id',
        role: Roles.PARTNER,
      });

      const res = await request(app)
        .get('/events/histories')
        .set('Authorization', 'Bearer token_valid');

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(
        'Anda tidak memiliki akses ke fitur ini',
      );
      expect(getEventRegistrationByUserId).not.toHaveBeenCalled();
    });

    test('Skenario 2: Harus return 200 jika Role VOLUNTEER', async () => {
      jwt.verify.mockReturnValue({
        id: 'user-volunteer-id',
        role: Roles.VOLUNTEER,
      });

      getUserById.mockResolvedValue({
        id: 'user-volunteer-id',
        role: Roles.VOLUNTEER,
      });

      const dummyHistory = [
        { id: 1, eventName: 'Event Keren', status: 'Approved' },
      ];
      getEventRegistrationByUserId.mockResolvedValue(dummyHistory);

      const res = await request(app)
        .get('/events/histories')
        .set('Authorization', 'Bearer token_valid');

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual(dummyHistory);
    });
  });

  describe('POST /events/:id/register', () => {
    const dummyEventId = '123e4567-e89b-12d3-a456-426614174000';
    const dummyFormId = '987fcdeb-51a2-43d1-9876-543210987654';
    const validBody = {
      formId: dummyFormId,
      answers: { alasan: 'Ingin belajar' },
    };

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.JWT_SECRET_KEY = 'test-secret';
    });

    test('Skenario 1: Harus return 403 jika Role user bukan VOLUNTEER', async () => {
      jwt.verify.mockReturnValue({ id: 'user-admin-id', role: Roles.PARTNER });

      getUserById.mockResolvedValue({
        id: 'user-partner-id',
        role: Roles.PARTNER,
      });

      const res = await request(app)
        .post(`/events/${dummyEventId}/register`)
        .set('Authorization', 'Bearer token_valid')
        .send(validBody);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(
        'Anda tidak memiliki akses ke fitur ini',
      );
      expect(getEventById).not.toHaveBeenCalled();
      expect(createFormResponse).not.toHaveBeenCalled();
    });

    test('Skenario 2: Harus return 200 jika role VOLUNTEER', async () => {
      jwt.verify.mockReturnValue({
        id: 'user-volunteer-id',
        role: Roles.VOLUNTEER,
      });

      getUserById.mockResolvedValue({
        id: 'user-volunteer-id',
        role: Roles.VOLUNTEER,
      });

      getEventById.mockResolvedValue({
        id: dummyEventId,
        isRelease: true,
      });

      getFormsByEventId.mockResolvedValue([
        { id: dummyFormId, eventId: dummyEventId },
      ]);

      getFormResponseByFormIdAndUserId.mockResolvedValue(null);
      createFormResponse.mockResolvedValue({
        id: 'response-1',
        status: 'SUCCESS',
      });

      const res = await request(app)
        .post(`/events/${dummyEventId}/register`)
        .set('Authorization', 'Bearer token_valid')
        .send(validBody);

      expect([200, 201]).toContain(res.statusCode);
      expect(createFormResponse).toHaveBeenCalled();
    });
  });
});
