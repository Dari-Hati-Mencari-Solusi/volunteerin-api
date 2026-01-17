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
  getUsers: jest.fn(),
};
const mockPartnerProfileModel = {
  reviewPartnerUserByUserId: jest.fn(),
};

const mockEjs = {
  renderFile: jest.fn().mockResolvedValue('<h1>Mock Email Content</h1>'),
};
const mockMailConfig = {
  sendEmail: jest.fn().mockResolvedValue(true),
};

jest.unstable_mockModule('ejs', () => ({ default: mockEjs }));
jest.unstable_mockModule(
  '../../../configs/mailConfig.js',
  () => mockMailConfig,
);
jest.unstable_mockModule('../../../models/User.js', () => mockUserModel);
jest.unstable_mockModule(
  '../../../models/PartnerProfile.js',
  () => mockPartnerProfileModel,
);
jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));

const { getUserById, getUsers } = await import('../../../models/User.js');
const { reviewPartnerUserByUserId } = await import(
  '../../../models/PartnerProfile.js'
);
const jwt = (await import('jsonwebtoken')).default;
const { default: userRoute } = await import(
  '../../../routes/admin/user.route.js'
);
const { sendEmail } = await import('../../../configs/mailConfig.js');

const app = express();
app.use(express.json());
userRoute(app);

describe('Integration Test [Role ADMIN]: User route', () => {
  describe('PATCH /admins/me/users/:id/review', () => {
    const dummyAdminUserId = '987fcdeb-51a2-43d1-9876-543210987654';
    const dummyUserId = '987fcdeb-51a2-43d1-9876-543210987654';
    const validBody = {
      userId: dummyUserId,
      reviewResult: 'ACCEPTED_PROFILE',
      reviewNotes: 'Semua dokumen sudah lengkap.',
    };

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.JWT_SECRET_KEY = 'test-secret';
      process.env.FE_BASE_URL = 'http://localhost:3000';
    });

    test('Skenario 1: Harus return 403 jika Role user bukan ADMIN', async () => {
      jwt.verify.mockReturnValue({
        id: dummyAdminUserId,
        role: Roles.VOLUNTEER,
      });
      getUserById.mockResolvedValue({
        id: dummyAdminUserId,
        role: Roles.VOLUNTEER,
      });

      const res = await request(app)
        .patch(`/admins/me/users/${dummyUserId}/review`)
        .set('Authorization', 'Bearer token_valid')
        .send(validBody);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(
        'Anda tidak memiliki akses ke fitur ini',
      );
      expect(reviewPartnerUserByUserId).not.toHaveBeenCalled();
    });

    test('Skenario 2: Harus return 200 jika Role ADMIN', async () => {
      jwt.verify.mockReturnValue({ id: dummyAdminUserId, role: Roles.ADMIN });
      getUserById.mockResolvedValueOnce({
        id: dummyAdminUserId,
        role: Roles.ADMIN,
      });

      getUserById.mockResolvedValueOnce({
        id: dummyUserId,
        name: 'Partner Budi',
        email: 'budi@example.com',
      });

      const mockUpdatedProfile = { id: 1, status: 'ACCEPTED_PROFILE' };
      reviewPartnerUserByUserId.mockResolvedValue(mockUpdatedProfile);

      sendEmail.mockResolvedValue(true);

      const payload = {
        reviewResult: 'ACCEPTED_PROFILE',
        information: 'Profil mantap',
      };

      const res = await request(app)
        .patch(`/admins/me/users/${dummyUserId}/review`)
        .set('Authorization', 'Bearer token_valid')
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch('Berhasil mereview profil partner!');
      expect(res.body.data).toEqual(mockUpdatedProfile);
    });
  });

  describe('GET /admins/me/users', () => {
    const dummyAdminUserId = '987fcdeb-51a2-43d1-9876-543210987654';

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.JWT_SECRET_KEY = 'test-secret';
      process.env.FE_BASE_URL = 'http://localhost:3000';
    });

    test('Skenario 1: Harus return 403 jika Role user bukan ADMIN', async () => {
      jwt.verify.mockReturnValue({
        id: dummyAdminUserId,
        role: Roles.PARTNER,
      });
      getUserById.mockResolvedValue({
        id: dummyAdminUserId,
        role: Roles.PARTNER,
      });

      const res = await request(app)
        .get(`/admins/me/users`)
        .set('Authorization', 'Bearer token_valid');

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(
        'Anda tidak memiliki akses ke fitur ini',
      );
      expect(getUsers).not.toHaveBeenCalled();
    });

    test('Skenario 2: Harus return 200 jika Role ADMIN', async () => {
      jwt.verify.mockReturnValue({
        id: dummyAdminUserId,
        role: Roles.ADMIN,
      });
      getUserById.mockResolvedValue({
        id: dummyAdminUserId,
        role: Roles.ADMIN,
      });

      const dummyUsers = [
        { id: 'user-1', name: 'User Satu' },
        { id: 'user-2', name: 'User Dua' },
      ];

      getUsers.mockResolvedValue(dummyUsers);

      const res = await request(app)
        .get(`/admins/me/users`)
        .set('Authorization', 'Bearer token_valid');

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch('Berhasil mengambil data pengguna');
      expect(res.body.users).toEqual(dummyUsers);
    });
  });
});
