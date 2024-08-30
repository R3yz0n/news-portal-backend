const { company, socialmedia, fileuploads } = require("../models");
const removeFile = require("../utils/remove_file");
const db = require("../models");


const getCompanyController = async (req, res, next) => {
  try {
    const data = await company.findAll({
      include: [
        {
          model: socialmedia,
          as: "social_media",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
          as: "social_media",
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
        {
          model: fileuploads,
          attributes: { exclude: ["created_at", "updated_at"] },
        },
      ],
      attributes: { exclude: ["created_at", "updated_at"] },
      attributes: { exclude: ["created_at", "updated_at"] },
    });
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      error: "server error",
    });
  }
}

const createCompanyController = async (req, res, next) => {
  let transactionx = await db.sequelize.transaction();
  const file = req.files.logo;
  //  console.log(file.filename)
  try {
    const checkCompanyData = await company.findAll({ attributes: ["name"] });
    if (checkCompanyData.length === 1) {
      removeFile(file.filename);
      return res.status(403).json({
        success: false,
        error: "Already  Create",
      });
    }
    const companyData = {
      name: req.body.name,
      slogan: req.body.slogan,
      phone_no: req.body.phone_no,
      external_phoneno: req.body.external_phoneno,
      email: req.body.email,
      sanchalak: req.body.salahakar,
      pradhan_sanchalak: req.body.pradhan_sanchalak,
      reporter: req.body.reporter,
      salahakar: req.body.salahakar,
      ji_pra_ka_ru_d_no: req.body.ji_pra_ka_ru_d_no,
      media_biva_registration_cretificate_no:
      req.body.media_biva_registration_cretificate_no,
      press_council_registration_no: req.body.press_council_registration_no,
      local_pra_registration_no: req.body.local_pra_registration_no,
      privacypolicy: req.body.privacypolicy,
      company_description: req.body.company_description,
    };
    // console.log(companyData)

    const fileInfo = await fileuploads.create({
      name: file.filename,
      size: file.size,
      type: file.mimetype,
    });
    companyData["logo_id"] = fileInfo.id;
    companyData["logo"] = file.filename;
    const data = await company.create(companyData, {
      transaction: transactionx,
    });
    companyData["id"] = data.id;
    let socialmedialink = req.body.social_media;
    socialmedialink = JSON.parse(socialmedialink);
    socialmedialink.map((value) => {
      value["company_id"] = data.id;
    });
    let socailMedia = await socialmedia.bulkCreate([...socialmedialink], {
      transaction: transactionx,
    });
    socailMedia.map((value) => {
      delete value.dataValues["created_at"];
      delete value.dataValues["updated_at"];
    });
    companyData["social_media"] = socailMedia;
    await transactionx.commit();
    return res.status(201).json({
      data: companyData,
      success: true,
      data: companyData,
    });
  } catch (error) {
    console.log(error);
    if (transactionx) {
      await transactionx.rollback();
    if (transactionx) {
      await transactionx.rollback();
    }
    //  removeFile(file.filename);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
  }


const deleteCompany = async (req, res) => {
  try {
    const data = await company.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "Deleted successful",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "company not found",
      });
    }
  } catch {
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: err });
  }
};

const updateCompany = async (id, editedCompanyData, transactionx) => {
  let updatedCompany = await company.update(
    editedCompanyData,
    {
      where: {
        id: id,
      },
    },
    { transaction: transactionx }
  );
  return updatedCompany;
};

const editCompany = async (req, res) => {
  let transactionx = await db.sequelize.transaction();
  const file = req.file;
  try {
    const editedCompanyData = {
      name: req.body.name,
      slogan: req.body.slogan,
      phone_no: req.body.phone_no,
      external_phoneno: req.body.external_phoneno,
      email: req.body.email,
      sanchalak: req.body.salahakar,
      pradhan_sanchalak: req.body.pradhan_sanchalak,
      reporter: req.body.reporter,
      salahakar: req.body.salahakar,
      ji_pra_ka_ru_d_no: req.body.ji_pra_ka_ru_d_no,
      media_biva_registration_cretificate_no:
        req.body.media_biva_registration_cretificate_no,
      press_council_registration_no: req.body.press_council_registration_no,
      local_pra_registration_no: req.body.local_pra_registration_no,
      privacypolicy: req.body.privacypolicy,
      company_description: req.body.company_description,
    };
    await updateCompany(req.params.id, editedCompanyData, transactionx);

    if (file != undefined) {
      const data = await company.findOne({
        where: {
          id: req.params.id,
        },
      });
      const imageId = data.logo_id;
      console.log(imageId);
      const fileName = await fileuploads.findAll(
        { where: imageId },
        { transaction: transactionx }
      );
      const fileInfo = await fileuploads.update(
        {
          name: file.filename,
          size: file.size,
          type: file.mimetype,
        },
        {
          where: {
            id: imageId,
          },
        },

        { transaction: transactionx }
      );
      console.log(fileInfo);
    }

    await socialmedia.destroy(
      {
        where: {
          company_id: req.params.id,
        },
      },
      { transaction: transactionx }
    );

    let socialmedialink = req.body.social_media;
    socialmedialink = JSON.parse(socialmedialink);
    socialmedialink.map((value) => {
      value["company_id"] = req.params.id;
    });
    filteredData = socialmedialink.map(
      ({ name, social_media_link, company_id }) => ({
        name,
        social_media_link,
        company_id,
      })
    );
    let socailMedia = await socialmedia.bulkCreate([...filteredData], {
      transaction: transactionx,
    });
    socailMedia.map((value) => {
      delete value.dataValues["created_at"];
      delete value.dataValues["updated_at"];
    });
    editedCompanyData["social_media"] = socailMedia;
    await transactionx.commit();
    return res.status(201).json({
      success: true,
      data: editedCompanyData,
    });
  } catch (error) {
    console.log(error);
    if (req.file) {
      removeFile(req.file.filename);
    }
    await transactionx.rollback();

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
    
  }

module.exports= {
    getCompanyController: getCompanyController,
    createCompanyController: createCompanyController,
    deleteCompany:deleteCompany,
    editCompany:editCompany
   
};
