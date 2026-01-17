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
  updateUserById: jest.fn(),
};
const mockPartnerProfileModel = {
  getPartnerProfileByUserId: jest.fn(),
  createPartnerProfile: jest.fn(),
};
const mockSharpInstance = {
  metadata: jest.fn(),
};
const mockSharp = jest.fn(() => mockSharpInstance);

jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));
jest.unstable_mockModule('../../../models/User.js', () => mockUserModel);
jest.unstable_mockModule(
  '../../../models/PartnerProfile.js',
  () => mockPartnerProfileModel,
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
jest.unstable_mockModule('sharp', () => ({ default: mockSharp }));

const { getUserById, updateUserById } = await import('../../../models/User.js');
const { getPartnerProfileByUserId, createPartnerProfile } = await import(
  '../../../models/PartnerProfile.js'
);
const jwt = (await import('jsonwebtoken')).default;
const { default: mockSharpLib } = await import('sharp');
const { default: profileRoute } = await import(
  '../../../routes/partner/partnerProfile.route.js'
);

const app = express();
app.use(express.json());
profileRoute(app);

describe('Integration Test [Role PARTNER]: Partner Profile route', () => {
  describe('POST /partners/me/profile', () => {
    const userId = 'user-partner-123';
    const validToken = 'Bearer valid_token';
    const validBody = {
      organizationType: 'COMMUNITY',
      organizationAddress: 'Jalan Sudirman No 1',
      instagram: '@komunitas_kita',
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
        .post('/partners/me/profile')
        .set('Authorization', validToken)
        .field('organizationType', 'COMMUNITY')
        .attach('logo', dummyImageBuffer, 'logo.jpg');

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(
        'Anda tidak memiliki akses ke fitur ini',
      );
      expect(createPartnerProfile).not.toHaveBeenCalled();
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

      getPartnerProfileByUserId.mockResolvedValue(null);

      mockSharpLib().metadata.mockResolvedValue({ width: 400, height: 400 });
      createPartnerProfile.mockResolvedValue({ id: 'profile-1', ...validBody });
      updateUserById.mockResolvedValue({
        id: userId,
        name: 'Partner User',
        avatarUrl: 'http://...',
      });

      const res = await request(app)
        .post('/partners/me/profile')
        .set('Authorization', validToken)
        .field('organizationType', validBody.organizationType)
        .field('organizationAddress', validBody.organizationAddress)
        .field('instagram', validBody.instagram)
        .attach('logo', dummyImageBuffer, {
          filename: 'logo.jpg',
          contentType: 'image/jpeg',
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toMatch(/berhasil dibuat/i);
      expect(res.body.data.partnerProfile).toBeDefined();
      expect(createPartnerProfile).toHaveBeenCalled();
      expect(updateUserById).toHaveBeenCalled();
    });
  });
});
