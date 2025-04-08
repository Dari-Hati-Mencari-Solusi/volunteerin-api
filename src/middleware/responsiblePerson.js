import * as responsiblePersonModel from "../models/ResponsiblePerson.js"
import { HttpError } from "../utils/error.js";

export const ensureResponsiblePersonExists = async (req, _, next) => {
  try {
      const { id: partnerProfileId } = req.partnerProfile;
      const responsiblePerson = await responsiblePersonModel.getResponsiblePersonByPartnerProfileId(partnerProfileId);
      
      if (!responsiblePerson) {
        throw new HttpError("Kamu belum mengisi Penanggungjawab, silahkan mengisi terlebih dahulu!", 400)
      }
  
      req.responsiblePerson = responsiblePerson;
      next();
    } catch (error) {
      next(error);
    }
}

export const ensureNoResponsiblePersonExists = async (req, _, next) => {
  try {
      const { id: partnerProfileId } = req.partnerProfile;
      const responsiblePerson = await responsiblePersonModel.getResponsiblePersonByPartnerProfileId(partnerProfileId);
      
      if (responsiblePerson) {
        throw new HttpError("Kamu sudah mengisi Penanggungjawab", 400)
      }
  
      req.responsiblePerson = responsiblePerson;
      next();
    } catch (error) {
      next(error);
    }
}