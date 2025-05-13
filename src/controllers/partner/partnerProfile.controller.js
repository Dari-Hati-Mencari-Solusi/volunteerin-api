import * as partnerProfileModel from '../../models/PartnerProfile.js';
import * as userModel from '../../models/User.js';
import { deleteImageFromImagekit, uploadToImageKit } from '../../utils/imagekit.js';

export const createPartnerProfile = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const uploadResponse = await uploadToImageKit(req.file);
    
    const partnerProfileData = {
      userId,
      ...req.body,
      createdAt: new Date(),
    };

    let partnerProfile =
      await partnerProfileModel.createPartnerProfile(partnerProfileData);
    const userAfterUpdate = await userModel.updateUserById(userId, {
      avatarImageId: uploadResponse.fileId,
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

export const getPartnerProfile = async (req, res, next) => {
  try {
    const { user } = req;

    const partnerProfile = await partnerProfileModel.getPartnerProfileByUserId(user.id);

    res.status(200).json({
      message: 'Berhasil mendapatkan data profile',
      data: partnerProfile
    });

  } catch (error) {
    next(error);
  }
}

export const updatePartnerProfile = async (req, res, next) => {
  try {
    const { id: userId, avatarImageId: fileId } = req.user;

    let userAfterUpdate = null;
    if (req.file) {
      await deleteImageFromImagekit(fileId);

      const uploadResponse = await uploadToImageKit(req.file);
      userAfterUpdate = await userModel.updateUserById(userId, {
        avatarImageId: uploadResponse.fileId,
        avatarUrl: uploadResponse.thumbnailUrl,
      });
    }

    const dataProfileWillUpdate = {
      ...req.body
    }

    const partnerProfileAfterUpdate = await partnerProfileModel.updatePartnerProfileByUserId(userId, dataProfileWillUpdate);

    return res.status(200).json({
      message: 'Profile kamu berhasil diubah.',
      data: {
        user: userAfterUpdate,
        partnerProfile: partnerProfileAfterUpdate,
      }
    });

  } catch (error) {
    next(error);
  }
}