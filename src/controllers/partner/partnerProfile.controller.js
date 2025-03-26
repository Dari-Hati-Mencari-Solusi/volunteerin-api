import * as partnerProfileModel from '../../models/PartnerProfile.js';
import * as userModel from '../../models/User.js';
import { HttpError } from '../../utils/error.js';
import { uploadToImageKit } from '../../utils/imagekit.js';

export const createPartnerProfile = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    if (req.uploadError) {
      throw req.uploadError;
    }

    let partnerProfile =
      await partnerProfileModel.getPartnerProfileByUserId(userId);

    if (partnerProfile) {
      throw new HttpError('Maaf, Anda sudah memiliki profile partner!', 400);
    }

    const { organizationType, organizationAddress, instagram } = req.body;

    const uploadResponse = await uploadToImageKit(req.file);

    const partnerProfileData = {
      userId,
      organizationType,
      organizationAddress,
      instagram,
      createdAt: new Date(),
    };

    partnerProfile =
      await partnerProfileModel.createPartnerProfile(partnerProfileData);
    const userAfterUpdate = await userModel.updateUserById(userId, {
      avatarUrl: uploadResponse.thumbnailUrl,
    });

    const data = {
      ...userAfterUpdate,
      partnerProfile,
    };

    res.status(201).json({
      message:
        'Profile penyelenggara berhasil dibuat, silahkan lanjut ke tahap selanjutnya...',
      data,
    });
  } catch (error) {
    next(error);
  }
};
