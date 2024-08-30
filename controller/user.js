const { where, Op } = require("sequelize");
const { user, fileuploads } = require("../models");
const db = require("../models");
const removeFile = require("../utils/remove_file");
const { comparePassword, getToken } = require("../utils/token");
const bcrypt = require("bcrypt");
const PaginationData = require("../utils/pagination");
const createUserController = async (req, res, next) => {
  const salt = bcrypt.genSaltSync(parseInt(process.env.SALTROUND));
  const { fullname, username, address, password, phone_no, gender } = req.body;
  const file = req.files.profile_image;
  let transactionx = await db.sequelize.transaction();
  const hash = bcrypt.hashSync(password, salt);
  try {
    const userData = {
      fullname: fullname,
      username: username,
      address: address,
      phone_no: phone_no,
      gender: gender,
      role: "user",
      password: hash,
    };
    const fileInfo = await fileuploads.create(
      {
        name: file.filename,
        size: file.size,
        type: file.mimetype,
      },
      { transaction: transactionx }
    );
    userData["user_profile_id"] = fileInfo.id;
    const data = await user.create(userData, { transaction: transactionx });
    userData["id"] = data.id;
    userData["profile_image"] = file.filename;
    await transactionx.commit();
    return res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (err) {
    console.log(err);
    await transactionx.rollback();

    removeFile(file.filename);
    if (err.original.code == "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Duplicate entry error" });
    }
    return res.status(500).json({
      success: true,
      error: "Server error",
    });
  }
};

const getUserController = async (req, res, nex) => {
  try {
    const { page = 0, size = 0 } = req.query;
    const { limit, offset } = PaginationData.getPagination(page, size);
    const { filter = "" } = req.query;
    const data = await user.findAndCountAll({
      limit,
      offset,
      where: {
        [Op.or]: [
          {
            fullname: {
              [Op.like]: `%${filter}%`,
            },
          },
          {
            username: {
              [Op.like]: `%${filter}%`,
            },
          },
          {
            address: {
              [Op.like]: `%${filter}%`,
            },
          },
          {
            gender: {
              [Op.like]: `%${filter}%`,
            },
          },
          {
            phone_no: {
              [Op.like]: `%${filter}%`,
            },
          },
        ],
      },
      attributes: [
        "id",
        "fullname",
        "username",
        "address",
        "gender",
        "phone_no",
        [db.Sequelize.literal("`fileupload`.`name`"), "profile_image"],
      ],
      include: {
        model: fileuploads,
        attributes: ["name"],
        required: true,
      },
      raw: true,
    });
    return res.status(200).json({
      success: true,
      data: data.rows,
      totaldata: data.count,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

const loginController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(username);
    const data = await user.findAll({
      where: {
        username: username,
      },
    });
    if (data.length == 0) {
      return res.status(401).json({
        success: false,
        error: "invaild username or password.",
      });
    }

    const userData = { ...data[0].dataValues };

    const checkPassword = await comparePassword(password, userData.password);
    const profileImage = await fileuploads.findAll({
      where: {
        id: userData.user_profile_id,
      },
      attributes: ["name"],
    });
    delete userData.password;
    delete userData.user_profile_id;
    if (checkPassword) {
      userData.profile_image = profileImage[0].name;
      const token = getToken(userData);
      return res.status(200).json({
        success: true,
        data: {
          token: token,
          user_data: userData,
        },
      });
    }
    return res.status(401).json({
      success: false,
      error: "invaild username or password.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Server ",
    });
  }
};

const editUserController = async (req, res, next) => {
  let transactionx = await db.sequelize.transaction();
  const file = req.file;

  const { fullname, address, phone_no, gender } = req.body;
  const editUserData = {
    fullname: fullname,
    address: address,
    phone_no: phone_no,
    gender: gender,
  };
  try {
    const data = await user.findAll({
      attributes: ["id", "fullname", "user_profile_id"],
      where: {
        id: req.params.id,
      },
    });

    if (data.length == 0) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    if (file === undefined) {
      let editedData = await user.update(
        editUserData,
        {
          where: {
            id: req.params.id,
          },
        },
        { transaction: transactionx }
      );
      await transactionx.commit();
      editedData = { editUserData };
      return res.status(200).json({
        success: true,
        data: editUserData,
      });
    }

    const imageId = data[0].user_profile_id;
    const imageName = await fileuploads.findAll(
      { where: { id: imageId } },
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
    const editedData = await user.update(
      editUserData,
      {
        where: {
          id: req.params.id,
        },
      },
      { transaction: transactionx }
    );
    if (fileInfo[0] == 1 && (editedData[0] == 1 || editedData[0] == 0)) {
      removeFile(imageName[0].name);
      editUserData["profile_image"] = req.file.filename;
      await transactionx.commit();
      return res.status(200).json({
        success: true,
        data: editUserData,
      });
    } else {
      await transactionx.rollback();
      removeFile(req.file.filename);
      return res.status(500).json({
        success: false,
        error: "Server error",
      });
    }
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
};

const deleteUser = async (req, res) => {
  try {
    const data = await user.destroy({
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
        message: "user not found",
      });
    }
  } catch {
    if (err.original.code == "ER_DUP_ENTRY") {
      return res.status(406).json({ error: "Duplicate entry error" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserDetailsController = async (req, res, next) => {
  try {
    const data = await user.findOne({
      attributes: [
        "id",
        "fullname",
        "username",
        "address",
        "gender",
        "phone_no",
        [db.Sequelize.literal("`fileupload`.`name`"), "profile_image"],
      ],
      include: {
        model: fileuploads,
        attributes: ["name"],
        required: true,
      },
      raw: true,
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

module.exports = {
  getUserDetailsController,
  createUserController,
  getUserController,
  loginController,
  editUserController,
  deleteUser,
};
