const { Model } = require("sequelize");
const { advertisement } = require("../models");

const getAdvertisementController = async (req, res, next) => {
  try {
    const data = await advertisement.findAll({
      attributes: { exclude: ["updated_at"] },
    });
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      data: "server error",
    });
  }
};

const getAdvertisementByIdController = async (req, res, next) => {
  try {
    const data = await advertisement.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["updated_at"] },
    });
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      data: "server error",
    });
  }
};

const editadvertisementController = async (req, res, next) => {
  try {
    let { rate } = req.body;
    const newData = {
      rate: rate,
    };
    const id = req.params.id;
    const data = await advertisement.update(newData, { where: { id: id } });
    console.log(data);

    return res.status(200).json({
      success: true,
      data: newData,
    });
  } catch (err) {
    console.log(err);
    if (err.original.code == "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Duplicate entry error" });
    }
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: err });
  }
};

module.exports = {
  getAdvertisementController,
  editadvertisementController,
  getAdvertisementByIdController,
};
