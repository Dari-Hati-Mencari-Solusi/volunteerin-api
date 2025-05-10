import { validate as isUUID } from 'uuid';
import { HttpError } from '../utils/error.js';
import * as userModel from '../models/User.js';
import * as partnerProfileModel from '../models/PartnerProfile.js';
import { sendEmail } from '../configs/mailConfig.js';
import ejs from 'ejs';
import path from 'path';

export const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.getUsers(req.query);

    res.status(200).json({
      message: 'Berhasil mengambil data pengguna',
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getDetailUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;

    if (!isUUID(userId)) {
      throw new HttpError('ID tidak valid', 400);
    }

    const user = await userModel.getUserById(userId, {
      profile: true,
      partner: {
        include: {
          legality: true,
          responsiblePersons: true,
        },
      },
    });

    if (!user) {
      throw new HttpError('Pengguna tidak ditemukan', 404);
    }

    res.status(200).json({
      message: 'Berhasil mengambil data pengguna',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};




const REVIEW_RESULTS = {
  ACCEPTED_PROFILE: 'ACCEPTED_PROFILE',
  ACCEPTED_LEGALITY: 'ACCEPTED_LEGALITY',
  REJECTED_PROFILE: 'REJECTED_PROFILE',
  REJECTED_LEGALITY: 'REJECTED_LEGALITY',
};

const REVIEW_MESSAGES = {
  [REVIEW_RESULTS.ACCEPTED_PROFILE]: 'Berhasil mereview profil partner!',
  [REVIEW_RESULTS.ACCEPTED_LEGALITY]: 'Berhasil mereview legalitas partner!',
  [REVIEW_RESULTS.REJECTED_PROFILE]: 'Berhasil menolak akun partner!',
  [REVIEW_RESULTS.REJECTED_LEGALITY]: 'Berhasil menolak legalitas akun partner!',
};

const EMAIL_SUBJECTS = {
  [REVIEW_RESULTS.ACCEPTED_PROFILE]: 'Akun Partner Anda Telah Disetujui!',
  [REVIEW_RESULTS.ACCEPTED_LEGALITY]: 'Legalitas Akun Partner Anda Telah Disetujui!',
  [REVIEW_RESULTS.REJECTED_PROFILE]: 'Maaf, Akun Anda Belum Disetujui',
  [REVIEW_RESULTS.REJECTED_LEGALITY]: 'Maaf, Legalitas Akun Anda Belum Disetujui',
};
const EMAIL_MESSAGES = {
  [REVIEW_RESULTS.ACCEPTED_PROFILE]: 'Selamat! Akun Partner Anda di Volunteerin telah berhasil disetujui oleh tim kami.',
  [REVIEW_RESULTS.ACCEPTED_LEGALITY]: 'Selamat! Legalitas Akun Partner Anda di Volunteerin telah berhasil disetujui oleh tim kami.',
};

export const reviewPartnerUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    let { reviewResult, information = null } = req.body;
    reviewResult = reviewResult?.toUpperCase();

    if (!isUUID(userId)) {
      throw new HttpError('ID tidak valid. Harus berupa UUID.', 400);
    }
    
    const user = await userModel.getUserById(userId);
    if (!user) {
      throw new HttpError('Pengguna tidak ditemukan', 404);
    }
      
    const partnerProfileAfterUpdate =
    await partnerProfileModel.reviewPartnerUserByUserId(
      userId,
      reviewResult,
      information,
    );
    
    
    // Send mail
    const sender = {
      address: 'hello@demomailtrap.com',
      name: 'Admin Volunteerin',
    };
    const recipients = ['volunteerinbusiness@gmail.com'];
    const subject = EMAIL_SUBJECTS[reviewResult];

    const dashboardPartnerUrl = `${process.env.FE_BASE_URL}/dashboard/partner`;
    const emailData = {
      name: user.name,
      dashboardPartnerUrl,
      title: subject, // subject ya si title juga
      message: EMAIL_MESSAGES[reviewResult] || information,
      status: reviewResult
    }

    const htmlContent = await ejs.renderFile(
      path.join(
        process.cwd(),
        './src/views/emails/account-approval-status.ejs',
      ),
      emailData,
    );

    await sendEmail(sender, recipients, subject, htmlContent);

    const message = REVIEW_MESSAGES[reviewResult] || REVIEW_MESSAGES.REJECTED;
    return res.status(200).json({
      message,
      data: partnerProfileAfterUpdate,
    });
  } catch (error) {
    next(error);
  }
};
