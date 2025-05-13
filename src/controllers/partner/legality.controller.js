import { uploadToImageKit } from "../../utils/imagekit.js";
import * as legalityModel from "../../models/Legality.js";
import * as partnerProfileModel from "../../models/PartnerProfile.js";

export const createLegality = async (req, res, next) => {
   try {
      const partnerProfile = req.partnerProfile;
  
      const { fileId, url } = await uploadToImageKit(req.file);
  
      const legalityData = {
        partnerProfileId: partnerProfile.id,
        ...req.body,
        documentImageId: fileId,
        documentUrl: url,
        createdAt: new Date()
      }
      
      const legality = await legalityModel.createLegality(legalityData);

      res.status(200).json({
        message: 'Legalitas berhasil disubmit. Silakan menunggu hingga 2 × 24 jam kerja untuk proses persetujuan proposal Anda. Jika melebihi waktu tersebut, silakan hubungi CS Kerjasama',
        data: legality
      });
    } catch (error) {
      next(error);
    }
}

export const getLegality = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: partnerProfileId } = await partnerProfileModel.getPartnerProfileByUserId(userId);

    const legality = await legalityModel.getLegalityByPartnerProfileId(partnerProfileId);

    res.status(200).json({
      message: 'Legalitas berhasil didapatkan',
      data: legality
    });

  } catch (error) {
    next(error)
  }
}

export const updateLegality = async (req, res, next) => {

}