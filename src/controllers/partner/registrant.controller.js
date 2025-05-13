import * as formResponseModel from '../../models/FormResponse.js';
import * as formModel from '../../models/Form.js';
import * as participantModel from '../../models/Participant.js';
import * as userModel from '../../models/User.js';
import * as eventModel from '../../models/Event.js';
import { validate as isUUID } from 'uuid';
import { HttpError } from '../../utils/error.js';
import { sendEmail } from '../../configs/mailConfig.js';
import ejs from 'ejs';
import path from 'path';

export const showRegistrantsList = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!isUUID(eventId)) {
      throw new HttpError('ID tidak valid', 400);
    }

    const form = await formModel.getFormsByEventId(eventId);

    const registrants = await formResponseModel.getRegistrants(
      form.id,
      req.query,
    );

    return res.status(200).json({
      message: 'Berhasil mendapatkan data pendaftar',
      registrants,
    });
  } catch (error) {
    next(error);
  }
};

export const showDetailRegistrant = async (req, res, next) => {
  try {
    const { eventId, registrantId } = req.params;

    if (!isUUID(eventId) || !isUUID(registrantId)) {
      throw new HttpError('ID tidak valid', 400);
    }

    const registrantDetail =
      await formResponseModel.getRegistrantById(registrantId);

    return res.status(200).json({
      message: 'Berhasil mendapatkan data pendaftar',
      data: registrantDetail,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewRegistrant = async (req, res, next) => {
  try {
    const { eventId, registrantId } = req.params;
    let { status } = req.body;

    status = status.toUpperCase();

    if (!isUUID(eventId) || !isUUID(registrantId)) {
      throw new HttpError('ID tidak valid', 400);
    }

    const registrantExist =
      await formResponseModel.getFormResponseById(registrantId);
    if (!registrantExist) {
      throw new HttpError('Pendaftar tidak ditemukan', 404);
    }

    const participantData = {
      userId: registrantExist.userId,
      eventId,
      formResponseId: registrantId,
      createdAt: new Date(),
    };

    const [registrantAfterUpdate, _] = await Promise.all([
      formResponseModel.updateRegistrantById(registrantId, { status }),
      participantModel.createParticipant(participantData),
    ]);

    

    // Email config and sending
    const [participantDetail, event] = await Promise.all([
      userModel.getUserById(registrantExist.userId),
      eventModel.getEventById(eventId),
    ]);

    const sender = {
      address: 'hello@demomailtrap.com',
      name: 'Admin Volunteerin',
    };
    const recipients = ['volunteerinbusiness@gmail.com'];
    const subject =
      status === 'ACCEPTED'
        ? `Selamat! Kamu Diterima sebagai Volunteer di ${event.title}`
        : `Terima Kasih Telah Mendaftar di ${event.title}`;
    const emailData = {
      titleEvent: event.title,
      name: participantDetail.name,
      historyEventPageUrl: `${process.env.FE_BASE_URL}/regis-event`,
      landingPageUrl: `${process.env.FE_BASE_URL}`,
      status: status.toLowerCase(),
    };

    const htmlContent = await ejs.renderFile(
      path.join(
        process.cwd(),
        './src/views/emails/registrant-approval-status.ejs',
      ),
      emailData,
    );

    await sendEmail(sender, recipients, subject, htmlContent);

    return res.status(200).json({
      message: 'Berhasil mereview pendaftar',
      data: registrantAfterUpdate,
    });
  } catch (error) {
    next(error);
  }
};
