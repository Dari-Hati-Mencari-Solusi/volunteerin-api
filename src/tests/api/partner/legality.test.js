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
const mockLegalityModel = {
  createLegality: jest.fn(),
};
const mockPartnerProfileModel = {
  getPartnerProfileByUserId: jest.fn(),
};

jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));
jest.unstable_mockModule('../../../models/User.js', () => mockUserModel);
jest.unstable_mockModule(
  '../../../models/Legality.js',
  () => mockLegalityModel,
);
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
            .mockResolvedValue({ url: 'http://dummy-url.com/proposal.pdf' }),
          deleteFile: jest.fn(),
          url: jest.fn(),
        };
      }
    },
  };
});

const jwt = (await import('jsonwebtoken')).default;
const { default: legalityRoute } = await import(
  '../../../routes/partner/legality.route.js'
);
const { getUserById } = await import('../../../models/User.js');
const { createLegality } = await import('../../../models/Legality.js');
const { getPartnerProfileByUserId } = await import(
  '../../../models/PartnerProfile.js'
);

const app = express();
app.use(express.json());
legalityRoute(app);

describe('Integration Test [Role PARTNER]: Legality route', () => {
  describe('POST /partners/me/legality', () => {
    const validToken = 'Bearer valid_token';
    const validBody = {
      documentName: 'proposal_ilmu',
      infomation: 'ini proposal',
    };
    const dummyPdfBuffer = Buffer.from('fake-pdf-content');

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
        .post('/partners/me/legality')
        .set('Authorization', validToken)
        .field('documentName', validBody.documentName)
        .field('infomation', validBody.infomation)
        .attach('document', dummyPdfBuffer, {
          filename: 'proposal.pdf',
          contentType: 'application/pdf',
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(
        'Anda tidak memiliki akses ke fitur ini',
      );
      expect(createLegality).not.toHaveBeenCalled();
    });

    test('Skenario 2: Harus return 200 jika Role PARTNER', async () => {
      jwt.verify.mockReturnValue({
        id: 'user-partner-id',
        role: Roles.PARTNER,
      });
      getUserById.mockResolvedValue({
        id: 'user-partner-id',
        role: Roles.PARTNER,
      });

      getPartnerProfileByUserId.mockReturnValue({ id: 'partner-profile-id' });

      const res = await request(app)
        .post('/partners/me/legality')
        .set('Authorization', validToken)
        .field('documentName', validBody.documentName)
        .field('infomation', validBody.infomation)
        .attach('document', dummyPdfBuffer, {
          filename: 'proposal.pdf',
          contentType: 'application/pdf',
        });

      expect([200, 201]).toContain(res.statusCode);
      expect(res.body.message).toMatch(/berhasil disubmit/i);
      expect(createLegality).toHaveBeenCalled();
    });
  });
});
