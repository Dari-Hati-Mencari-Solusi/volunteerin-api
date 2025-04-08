import * as partnerProfileModel from "../models/PartnerProfile.js"
import { HttpError } from "../utils/error.js";

export const ensurePartnerProfileExists = async (req, _, next) => {
  try {
    const { id: userId } = req.user;
    const partnerProfile = await partnerProfileModel.getPartnerProfileByUserId(userId);
    
    if (!partnerProfile) {
      throw new HttpError("Kamu belum mengisi profile, silahkan mengisi terlebih dahulu!", 400)
    }

    req.partnerProfile = partnerProfile;
    next();
  } catch (error) {
    next(error);
  }
}

export const ensureNoPartnerProfileExists = async (req, _, next) => {
  try {
    const { id: userId } = req.user;
    const partnerProfile = await partnerProfileModel.getPartnerProfileByUserId(userId);
    
    if (partnerProfile) {
      throw new HttpError('Maaf, Anda sudah memiliki profile partner!', 400);
    }

    req.partnerProfile = partnerProfile;
    next();
  } catch (error) {
    next(error);
  }
}
