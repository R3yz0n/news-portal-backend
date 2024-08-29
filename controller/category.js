const { Model } = require("sequelize");
const { category } = require("../models");

const createCategoryController = async (req, res, next) => {
  let { name } = req.body;
  name = name.replace(/\s+/g, " ").trim();

  const slug = name.replace(/\s+/g, "-");

  try {
    const data = await category.create({ name: name, slug: slug });
    const newData = {};
    newData["id"] = data.id;
    newData["name"] = name;
    newData["slug"] = slug;
    console.log(newData);
    return res.status(200).json({
      success: true,
      data: newData,
    });
  } catch (err) {
    console.log(err);
    if (err.original.code == "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Category already exits" });
    }

    return res
      .status(500)
      .json({ error: "Internal Server Error", message: err });
  }
};

const getCategoryController = async (req, res, next) => {
  try {
    const data = await category.findAll({
      attributes: { exclude: ["created_at", "updated_at"] },
      order: [["id", "ASC"]],
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
const updateCategoryController = async (req, res, next) => {
  try {
    let { name } = req.body;
    console.log(name);
    const id = req.params.id;
    name = name.replace(/\s+/g, " ").trim();
    console.log(name);
    const slug = name.replace(/\s+/g, "-");
    console.log(slug);
    const data = await category.update(
      { name: name, slug: slug },
      { where: { id: id } }
    );
    if (data.length >= 1) {
      dataEdit = {};
      dataEdit["id"] = id;
      dataEdit["name"] = name;
      dataEdit["slug"] = slug;
      return res.status(200).json({
        success: true,
        data: dataEdit,
      });
    }
    return res.status(409).json({
      success: false,
      error: "Unable to Update",
    });
  } catch (err) {
    console.log(err);
    if (err.original.code == "ER_DUP_ENTRY") {
      return res.status(406).json({ error: "Duplicate entry error" });
    }

    return res
      .status(500)
      .json({ error: "Internal Server Error", message: err });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const data = await category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "Deleted successful",
      });
    }
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  } catch {
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: err });
  }
};

const getDetailsController = async (req, res, next) => {
  try {
    const data = await category.findOne({
      attributes: { exclude: ["created_at", "updated_at"] },
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
      data: "server error",
    });
  }
};

module.exports = {
  createCategoryController,
  getCategoryController,
  updateCategoryController,
  deleteCategory,
  getDetailsController,
};
