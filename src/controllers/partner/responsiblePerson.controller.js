import * as partnerProfileModel from "../../models/PartnerProfile.js";
import * as responsiblePersonModel from "../../models/ResponsiblePerson.js";
import { deleteImageFromImagekit, uploadToImageKit } from "../../utils/imagekit.js";

export const createResponsiblePerson = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    
    let partnerProfile =
      await partnerProfileModel.getPartnerProfileByUserId(userId);
    

    const { fileId, thumbnailUrl } = await uploadToImageKit(req.file);

    let { position } = req.body;
    position = position.toLowerCase();

    const responsiblePersonData = {
      partnerProfileId: partnerProfile.id,
      ...req.body,
      position,
      ktpImageId: fileId,
      ktpUrl: thumbnailUrl,
      createdAt: new Date()
    }
    
    const responsiblePerson = await responsiblePersonModel.createResponsiblePerson(responsiblePersonData);
    res.status(200).json({
      message: 'Penanggungjawab berhasil dibuat',
      data: responsiblePerson
    });
  } catch (error) {
    next(error);
  }
}

export const getResponsiblePerson = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const { id: partnerProfileId } = await partnerProfileModel.getPartnerProfileByUserId(userId);

    const responsiblePerson = await responsiblePersonModel.getResponsiblePersonByPartnerProfileId(partnerProfileId);

    return res.status(200).json({
      message: 'Penanggunjawab berhasil didapatkan',
      data: responsiblePerson
    });
  } catch (error) {
    next(error)
  }
}

export const updateResponsiblePerson = async (req, res, next) => {
  try {
    
    const { id: partnerProfileId } = req.partnerProfile;

    const { ktpImageId } = await responsiblePersonModel.getResponsiblePersonByPartnerProfileId(partnerProfileId);

    let uploadResponse = null;
    if (req.file) {
      await deleteImageFromImagekit(ktpImageId);

      uploadResponse = await uploadToImageKit(req.file);
    }

    let { position } = req.body;
    position = position.toLowerCase();

    const responsiblePersonData = {
      partnerProfileId,
      ...req.body,
      position,
      ...(uploadResponse && {
        ktpImageId: uploadResponse.fileId,
        ktpUrl: uploadResponse.thumbnailUrl
      })
    }

    const responsiblePersonAfterUpdate = await responsiblePersonModel.updateResponsiblePersonByPartnerProfileId(
      partnerProfileId,
      responsiblePersonData
    )

    res.status(200).json({
      message: 'Berhasil mengubah Penanggungjawab',
      data: responsiblePersonAfterUpdate
    });


  } catch (error) {
    next(error);
  }
}