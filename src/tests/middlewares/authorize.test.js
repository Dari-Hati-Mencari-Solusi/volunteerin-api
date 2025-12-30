import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { authorize } from '../../middleware/access.js';
import { Roles } from '../../constants/roles.js';

describe('Middleware: authorize', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      user: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  test('UT-01: Akses Peran Terotorisasi: next() harus dipanggil jika role user sesuai', () => {
    const allowedRoles = [Roles.ADMIN, Roles.PARTNER];

    mockReq.user.role = Roles.ADMIN;
    const middleware = authorize(allowedRoles);

    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  test('UT-02: authorize() harus menolak request ketika peran user TIDAK terotorisasi', () => {
    const allowedRoles = [Roles.ADMIN, Roles.PARTNER];
    mockReq.user.role = Roles.VOLUNTEER;

    const middleware = authorize(allowedRoles);
    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Anda tidak memiliki akses ke fitur ini',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('UT-03: authorize() dengan daftar peran kosong harus menolak semua request', () => {
    const allowedRoles = [];
    mockReq.user.role = Roles.VOLUNTEER;

    const middleware = authorize(allowedRoles);
    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Anda tidak memiliki akses ke fitur ini',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('UT-04: Admin harus tunduk pada aturan yang sama', () => {
    const allowedRoles = [Roles.PARTNER];
    mockReq.user.role = Roles.ADMIN;

    const middleware = authorize(allowedRoles);
    middleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Anda tidak memiliki akses ke fitur ini',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
