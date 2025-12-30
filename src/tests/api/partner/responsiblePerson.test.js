import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { Roles } from '../../../constants/roles.js';

const mockJwt = {
  verify: jest.fn(),
  JsonWebTokenError: class {},
  TokenExpiredError: class {},
};
const mockUserModel = {
  getUserById: jest.fn(),
};
const mockPartnerProfileModel = {
  getPartnerProfileByUserId: jest.fn(),
  createPartnerProfile: jest.fn(),
};
const mockResponsiblePersonModel = {
  createResponsiblePerson: jest.fn(),
  getResponsiblePersonByPartnerProfileId: jest.fn(),
};

jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));
jest.unstable_mockModule('../../../models/User.js', () => mockUserModel);
jest.unstable_mockModule(
  '../../../models/PartnerProfile.js',
  () => mockPartnerProfileModel,
);
jest.unstable_mockModule(
  '../../../models/ResponsiblePerson.js',
  () => mockResponsiblePersonModel,
);
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

const { getUserById } = await import('../../../models/User.js');
const { createResponsiblePerson, getResponsiblePersonByPartnerProfileId } =
  await import('../../../models/ResponsiblePerson.js');
const { getPartnerProfileByUserId } = await import(
  '../../../models/PartnerProfile.js'
);
const jwt = (await import('jsonwebtoken')).default;
const { default: responsiblePersonRoute } = await import(
  '../../../routes/partner/responsiblePerson.route.js'
);

const app = express();
app.use(express.json());
responsiblePersonRoute(app);

describe('Integration Test [Role PARTNER]: Responsible Person route', () => {
  describe('POST /partners/me/responsible-person', () => {
    const validToken = 'Bearer valid_token';
    const validBody = {
      nik: '1234567890123456',
      fullName: 'John Doe',
      phoneNumber: '081234567890',
      position: 'Manager',
    };
    const dummyImageBuffer = Buffer.from('fake-image-content');

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.JWT_SECRET_KEY = 'test-secret';
    });

    test('Skenario 1: Harus return 403 jika Role user bukan PARTNER', async () => {
      jwt.verify.mockReturnValue({
        id: 'user-volunteer-id',
        role: Roles.VOLUNTEER,
      });

      getUserById.mockResolvedValue({
        id: 'user-volunteer-id',
        role: Roles.VOLUNTEER,
      });

      const res = await request(app)
        .post('/partners/me/responsible-person')
        .set('Authorization', validToken)
        .field('nik', validBody.nik)
        .field('fullName', validBody.fullName)
        .field('phoneNumber', validBody.phoneNumber)
        .field('position', validBody.position)
        .attach('ktp', dummyImageBuffer, 'ktp.jpg');

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(
        'Anda tidak memiliki akses ke fitur ini',
      );
      expect(createResponsiblePerson).not.toHaveBeenCalled();
    });

    test('Skenario 2: Harus return 201 jika Role PARTNER', async () => {
      jwt.verify.mockReturnValue({
        id: 'user-partner-id',
        role: Roles.PARTNER,
      });
      getUserById.mockResolvedValue({
        id: 'user-partner-id',
        role: Roles.PARTNER,
      });

      getPartnerProfileByUserId.mockResolvedValue([]);
      getResponsiblePersonByPartnerProfileId.mockResolvedValue(null);
      createResponsiblePerson.mockResolvedValue({
        id: 'responsible-person-1',
        ...validBody,
      });

      const res = await request(app)
        .post('/partners/me/responsible-person')
        .set('Authorization', validToken)
        .field('nik', validBody.nik)
        .field('fullName', validBody.fullName)
        .field('phoneNumber', validBody.phoneNumber)
        .field('position', validBody.position)
        .attach('ktp', dummyImageBuffer, {
          filename: 'ktp.jpg',
          contentType: 'image/jpeg',
        });
      expect([200, 201]).toContain(res.statusCode);
      expect(res.body.message).toMatch(/berhasil dibuat/i);
      expect(createResponsiblePerson).toHaveBeenCalled();
    });
  });
});
