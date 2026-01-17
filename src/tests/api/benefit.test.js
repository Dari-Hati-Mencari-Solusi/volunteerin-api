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
const mockBenefitModel = {
  getBenefitsByUserId: jest.fn(),
};

jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));
jest.unstable_mockModule('../../models/User.js', () => mockUserModel);
jest.unstable_mockModule('../../models/User.js', () => mockUserModel);
jest.unstable_mockModule('../../models/Benefit.js', () => mockBenefitModel);

const { getUserById } = await import('../../models/User.js');
const { getBenefitsByUserId } = await import('../../models/Benefit.js');
const jwt = (await import('jsonwebtoken')).default;
const { default: benefitRoute } = await import('../../routes/benefit.route.js');

const app = express();
app.use(express.json());
benefitRoute(app);

describe('Integration Test [Role PARTNER & ADMIN]: Benefits route', () => {
  describe('GET /benefits/my-benefits', () => {
    const userId = 'user-partner-123';
    const validToken = 'Bearer valid_token';

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.JWT_SECRET_KEY = 'test-secret';
    });

    test('Skenario 1: Harus return 403 jika Role user bukan PARTNER atau ADMIN', async () => {
      jwt.verify.mockReturnValue({ id: userId, role: Roles.VOLUNTEER });
      getUserById.mockResolvedValue({ id: userId, role: Roles.VOLUNTEER });

      const res = await request(app)
        .get(`/benefits/my-benefits`)
        .set('Authorization', validToken);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/tidak memiliki akses/i);
      expect(getBenefitsByUserId).not.toHaveBeenCalled();
    });

    describe('Skenario 2', () => {
      test('a. Harus return 200 jika Role PARTNER', async () => {
        jwt.verify.mockReturnValue({ id: userId, role: Roles.PARTNER });
        getUserById.mockResolvedValue({ id: userId, role: Roles.PARTNER });

        const res = await request(app)
          .get(`/benefits/my-benefits`)
          .set('Authorization', validToken);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(
          'Berhasil mendapatkan daftar benefits',
        );
        expect(getBenefitsByUserId).toHaveBeenCalled();
      });

      test('b. Harus return 200 jika Role ADMIN', async () => {
        jwt.verify.mockReturnValue({ id: userId, role: Roles.ADMIN });
        getUserById.mockResolvedValue({ id: userId, role: Roles.ADMIN });

        const res = await request(app)
          .get(`/benefits/my-benefits`)
          .set('Authorization', validToken);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(
          'Berhasil mendapatkan daftar benefits',
        );
        expect(getBenefitsByUserId).toHaveBeenCalled();
      });
    });
  });
});
