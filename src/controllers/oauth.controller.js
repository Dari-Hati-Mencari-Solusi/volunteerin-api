import axios from 'axios';
import * as userModel from '../models/User.js';
import { HttpError } from '../utils/error.js';
import { generateToken } from '../utils/jwt.js';
import { oauth2Client, scopes } from '../configs/googleOAuthConfig.js';

export const loginGoogle = async (_req, res, next) => {
  try {
    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true,
      prompt: 'consent',
    });

    res.redirect(authorizationUrl);
  } catch (error) {
    next(error);
  }
};

export const callbackLoginGoogle = async (req, res, next) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);

    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
    );

    if (!data.email || !data.email_verified) {
      return next(new HttpError('Akun Google Anda belum diverifikasi', 401));
    }

    let user = await userModel.getUserByEmail(data.email);

    if (!user) {
      user = await userModel.createUser({
        name: data.name,
        email: data.email,
        avatarUrl: data.picture ?? '',
      });
    }

    const token = generateToken({ id: user.id }, '1d');

    res.redirect(`${process.env.GOOGLE_REDIRECT_URL}?t=${token}`);
  } catch (error) {
    next(error);
  }
};
