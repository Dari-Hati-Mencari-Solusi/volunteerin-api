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
};
const mockEventModel = {
  createEvent: jest.fn(),
  updateEventById: jest.fn(),
  getEventById: jest.fn(),
  deleteEvent: jest.fn(),
  getEventsByUserId: jest.fn(),
};
const mockSharpInstance = {
  metadata: jest.fn(),
};
const mockSharp = jest.fn(() => mockSharpInstance);

jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));
jest.unstable_mockModule('../../../models/User.js', () => mockUserModel);
jest.unstable_mockModule('../../../models/Event.js', () => mockEventModel);
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

const { getUserById } = await import('../../../models/User.js');
const {
  createEvent,
  updateEventById,
  getEventById,
  deleteEvent,
  getEventsByUserId,
} = await import('../../../models/Event.js');
const { getPartnerProfileByUserId } = await import(
  '../../../models/PartnerProfile.js'
);
const jwt = (await import('jsonwebtoken')).default;
const { default: mockSharpLib } = await import('sharp');
const { default: eventRoute } = await import(
  '../../../routes/partner/event.route.js'
);

const app = express();
app.use(express.json());
eventRoute(app);
app.use((err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

describe('Integration Test [Role PARTNER]: Partner Events route', () => {
  describe('POST /partners/me/events', () => {
    const userId = 'user-partner-123';
    const validToken = 'Bearer valid_token';
    const dummyBuffer = Buffer.from('fake-image-content');

    const categoryId = '123e4567-e89b-12d3-a456-426614174000';
    const benefitId = '987fcdeb-51a2-43d1-9876-543210987654';

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.JWT_SECRET_KEY = 'test-secret';
    });

    test('Skenario 1: Harus return 403 jika role user bukan PARTNER', async () => {
      jwt.verify.mockReturnValue({
        id: 'user-volunteer-id',
        role: Roles.ADMIN,
      });

      getUserById.mockResolvedValue({
        id: 'user-volunteer-id',
        role: Roles.ADMIN,
      });

      const res = await request(app)
        .post('/partners/me/events')
        .set('Authorization', 'Bearer valid_token')
        .field('organizationType', 'COMMUNITY')
        .attach('banner', dummyBuffer, {
          filename: 'banner.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(
        'Anda tidak memiliki akses ke fitur ini',
      );
      expect(createEvent).not.toHaveBeenCalled();
    });

    test('Skenario 2: Harus return 201 jika role user adalah PARTNER', async () => {
      jwt.verify.mockReturnValue({ id: userId, role: 'PARTNER' });
      getUserById.mockResolvedValue({ id: userId, role: 'PARTNER' });

      createEvent.mockResolvedValue({
        id: 'new-event-1',
        title: 'Lomba Lari',
        slug: 'lomba-lari',
        userId,
      });

      mockSharpLib().metadata.mockResolvedValue({ width: 800, height: 600 });

      const res = await request(app)
        .post('/partners/me/events')
        .set('Authorization', validToken)
        .attach('banner', dummyBuffer, 'banner.jpg')
        .field('title', 'Lomba Lari')
        .field('type', 'OPEN')
        .field('description', 'Deskripsi event keren')
        .field('requirement', 'Syarat harus sehat')
        .field('contactPerson', '08123456789')
        .field('startAt', new Date().toISOString())
        .field('endAt', new Date().toISOString())
        .field('province', 'Jawa Tengah')
        .field('regency', 'Sleman')
        .field('address', 'Jalan Kaliurang')
        .field('isRelease', 'true')
        .field('isPaid', 'false')
        .field('categoryIds', JSON.stringify([categoryId]))
        .field('benefitIds', JSON.stringify([benefitId]));

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toMatch(/berhasil dibuat/i);
      expect(res.body.data).toBeDefined();
      expect(createEvent).toHaveBeenCalled();
    });
  });

  describe('PATCH /partners/me/events/:id', () => {
    const userId = 'user-partner-123';
    const eventId = 'event-123';
    const validToken = 'Bearer valid_token';
    const dummyBuffer = Buffer.from('fake-image-content');

    const categoryId = '123e4567-e89b-12d3-a456-426614174000';
    const benefitId = '987fcdeb-51a2-43d1-9876-543210987654';

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.JWT_SECRET_KEY = 'test-secret';
    });

    test('Skenario 1: Harus return 403 jika Role user bukan PARTNER', async () => {
      jwt.verify.mockReturnValue({ id: 'user-vol-1', role: Roles.VOLUNTEER });
      getUserById.mockResolvedValue({
        id: 'user-vol-1',
        role: Roles.VOLUNTEER,
      });

      const res = await request(app)
        .patch(`/partners/me/events/${eventId}`)
        .set('Authorization', validToken)
        .field('title', 'AMCC AGS 2026');

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/tidak memiliki akses/i);
      expect(updateEventById).not.toHaveBeenCalled();
    });

    test('Skenario 2: Harus return 200 jika Role PARTNER', async () => {
      jwt.verify.mockReturnValue({ id: userId, role: Roles.PARTNER });
      getUserById.mockResolvedValue({ id: userId, role: Roles.PARTNER });
      getPartnerProfileByUserId.mockResolvedValue({ id: 'profile-1', userId });

      const oldBannerId = 'old-banner-id';
      getEventById.mockResolvedValue({
        id: eventId,
        userId: userId,
        title: 'Judul Lama',
        bannerImageId: oldBannerId,
      });

      updateEventById.mockResolvedValue({
        id: eventId,
        title: 'Judul Revisi',
        userId,
      });

      mockSharpLib().metadata.mockResolvedValue({ width: 100, height: 100 });

      const res = await request(app)
        .patch(`/partners/me/events/${eventId}`)
        .set('Authorization', validToken)
        .attach('banner', dummyBuffer, 'new.jpg')
        .field('title', 'Judul Revisi')
        .field('type', 'OPEN')
        .field('description', 'Deskripsi baru')
        .field('requirement', 'Syarat baru')
        .field('contactPerson', '08123456789')
        .field('startAt', new Date().toISOString())
        .field('endAt', new Date().toISOString())
        .field('province', 'Jawa Tengah')
        .field('regency', 'Semarang')
        .field('address', 'Jalan Pemuda')
        .field('isRelease', 'true')
        .field('categoryIds', JSON.stringify([categoryId]))
        .field('benefitIds', JSON.stringify([benefitId]));

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/berhasil diupdate/i);
      expect(updateEventById).toHaveBeenCalled();
    });

    test('Skenario 3: Harus menolak akses (403) jika Event bukan milik user login', async () => {
      jwt.verify.mockReturnValue({ id: userId, role: Roles.PARTNER });
      getUserById.mockResolvedValue({ id: userId, role: Roles.PARTNER });
      getPartnerProfileByUserId.mockResolvedValue({ id: 'profile-1', userId });
      getEventById.mockResolvedValue({
        id: eventId,
        userId: 'user-partner-LAIN',
        title: 'Event Orang Lain',
      });

      const res = await request(app)
        .patch(`/partners/me/events/${eventId}`)
        .set('Authorization', validToken)
        .field('title', 'Hacked Title');

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(
        'Anda tidak memiliki akses untuk event ini',
      );
      expect(updateEventById).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /partners/me/events/:id', () => {
    const userId = 'user-partner-123';
    const eventId = 'event-123';
    const validToken = 'Bearer valid_token';

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.JWT_SECRET_KEY = 'test-secret';
    });

    test('Skenario 1: Harus return 403 jika Role user bukan PARTNER', async () => {
      jwt.verify.mockReturnValue({ id: userId, role: Roles.VOLUNTEER });
      getUserById.mockResolvedValue({ id: userId, role: Roles.VOLUNTEER });

      const res = await request(app)
        .delete(`/partners/me/events/${eventId}`)
        .set('Authorization', validToken);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/tidak memiliki akses/i);
      expect(deleteEvent).not.toHaveBeenCalled();
    });

    test('Skenario 2: Harus return 200 jika Role PARTNER', async () => {
      jwt.verify.mockReturnValue({ id: userId, role: Roles.PARTNER });
      getUserById.mockResolvedValue({ id: userId, role: Roles.PARTNER });
      getEventById.mockResolvedValue({ id: eventId, userId });

      const res = await request(app)
        .delete(`/partners/me/events/${eventId}`)
        .set('Authorization', validToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/berhasil dihapus/i);
      expect(deleteEvent).toHaveBeenCalled();
    });

    test('Skenario 3: Harus menolak akses (403) jika Event bukan milik user login', async () => {
      jwt.verify.mockReturnValue({ id: userId, role: Roles.PARTNER });
      getUserById.mockResolvedValue({ id: userId, role: Roles.PARTNER });
      getEventById.mockResolvedValue({
        id: eventId,
        userId: 'user-partner-LAIN',
        title: 'Event Orang Lain',
      });

      const res = await request(app)
        .delete(`/partners/me/events/${eventId}`)
        .set('Authorization', validToken);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(
        'Anda tidak memiliki akses untuk event ini',
      );
      expect(deleteEvent).not.toHaveBeenCalled();
    });
  });

  describe('GET /partners/me/events/:id', () => {
    const userId = 'user-partner-123';
    const eventId = 'event-123';
    const validToken = 'Bearer valid_token';

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.JWT_SECRET_KEY = 'test-secret';
    });

    test('Skenario 1: Harus return 403 jika Role user bukan PARTNER', async () => {
      jwt.verify.mockReturnValue({ id: userId, role: Roles.VOLUNTEER });
      getUserById.mockResolvedValue({ id: userId, role: Roles.VOLUNTEER });

      const res = await request(app)
        .get(`/partners/me/events/${eventId}`)
        .set('Authorization', validToken);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/tidak memiliki akses/i);
      expect(getEventById).not.toHaveBeenCalled();
    });

    test('Skenario 2: Harus return 200 jika Role PARTNER', async () => {
      jwt.verify.mockReturnValue({ id: userId, role: Roles.PARTNER });
      getUserById.mockResolvedValue({ id: userId, role: Roles.PARTNER });
      getEventById.mockResolvedValue({ id: eventId, userId });

      const res = await request(app)
        .get(`/partners/me/events/${eventId}`)
        .set('Authorization', validToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch('Berhasil mendapatkan data event');
      expect(getEventById).toHaveBeenCalled();
    });

    test('Skenario 3: Harus menolak akses (403) jika Event bukan milik user login', async () => {
      jwt.verify.mockReturnValue({ id: userId, role: Roles.PARTNER });
      getUserById.mockResolvedValue({ id: userId, role: Roles.PARTNER });
      getEventById.mockResolvedValue({
        id: eventId,
        userId: 'user-partner-LAIN',
        title: 'Event Orang Lain',
      });

      const res = await request(app)
        .get(`/partners/me/events/${eventId}`)
        .set('Authorization', validToken);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(
        'Anda tidak memiliki akses untuk event ini',
      );
      expect(getEventById).toHaveBeenCalledWith(eventId);
      expect(getEventById).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /partners/me/events', () => {
    const userId = 'user-partner-123';
    const eventId = 'event-123';
    const validToken = 'Bearer valid_token';

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.JWT_SECRET_KEY = 'test-secret';
    });

    test('Skenario 1: Harus return 403 jika Role user bukan PARTNER', async () => {
      jwt.verify.mockReturnValue({ id: userId, role: Roles.VOLUNTEER });
      getUserById.mockResolvedValue({ id: userId, role: Roles.VOLUNTEER });

      const res = await request(app)
        .get(`/partners/me/events`)
        .set('Authorization', validToken);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/tidak memiliki akses/i);
      expect(getEventsByUserId).not.toHaveBeenCalled();
    });

    test('Skenario 2: Harus return 200 jika Role PARTNER', async () => {
      jwt.verify.mockReturnValue({ id: userId, role: Roles.PARTNER });
      getUserById.mockResolvedValue({ id: userId, role: Roles.PARTNER });
      getEventById.mockResolvedValue({ id: eventId, userId });

      const res = await request(app)
        .get(`/partners/me/events`)
        .set('Authorization', validToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch('Berhasil mendapatkan data event');
      expect(getEventsByUserId).toHaveBeenCalled();
    });

    test('Skenario 3: Harus hanya mengambil data milik user yang login', async () => {
      const loggedInUserId = 'user-partner-A';

      jwt.verify.mockReturnValue({ id: loggedInUserId, role: Roles.PARTNER });
      getUserById.mockResolvedValue({
        id: loggedInUserId,
        role: Roles.PARTNER,
      });

      const mockEvents = [
        { id: 'ev-1', title: 'Event A', userId: loggedInUserId },
        { id: 'ev-2', title: 'Event B', userId: loggedInUserId },
      ];

      getEventsByUserId.mockResolvedValue(mockEvents);

      const res = await request(app)
        .get(`/partners/me/events`)
        .set('Authorization', validToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(getEventsByUserId).toHaveBeenCalledWith(
        loggedInUserId,
        expect.anything(),
      );
    });
  });
});
