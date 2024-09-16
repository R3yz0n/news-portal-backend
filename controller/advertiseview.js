const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const { advertisement, advertises, category,fileuploads } = require("../models");
const groupBy = require("../utils/group");

const homePageAdvertise = async (req, res) => {
  try {
    const parsedDate = new Date();
    const formattedDate = parsedDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
    
    console.log("formattedDate:"+formattedDate);
    
    
    const advertisesData = await advertises.findAll({
      attributes: ["id", "image","start_date","end_date"],
      where: {
        start_date: {
          [Op.lte]: formattedDate,
        },
        end_date: {
          [Op.gte]: formattedDate,
        },
        status: 1,
      },
      order: [["id", "DESC"]],
      include: [
        {
          model: advertisement,
          attributes: ["id", "type"],
        },
          { 
            model: fileuploads,
            as: "ads_image",
            attributes: { exclude: ["updated_at"] },
          },
      ],
    });

    const advertisesList = groupBy("advertisement", advertisesData);
    return res.status(200).json({
      success: true,
      advertises: advertisesList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

const specificCategoryAdversties = async (req, res) => {
  try {
    const categorySlug = req.params.category_slug;
    const categoryData = await category.findOne({
      where: { slug: categorySlug },
      attributes: ["id", "slug"],
    });
    const parsedDate = new Date();

    const formattedDate = `${parsedDate.getFullYear()}-${
      parsedDate.getMonth() + 1
    }-${parsedDate.getDate()}`;

    const advertisesData = await advertises.findAll({
      attributes: ["id", "image"],
      where: {
        where_to_display: categoryData.id,
        advertisement_id: 6,
        start_date: {
          [Sequelize.Op.lte]: formattedDate,
        },
        end_date: {
          [Sequelize.Op.gte]: formattedDate,
        },
        status: 1,
      },
      order: [["id", "DESC"]],
    });
    return res.status(200).json({
      success: true,
      advertises: advertisesData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const postDetailsAdverstises = async (req, res) => {
  try {
    const parsedDate = new Date();

    const formattedDate = `${parsedDate.getFullYear()}-${
      parsedDate.getMonth() + 1
    }-${parsedDate.getDate()}`;
    const advertisesData = await advertises.findAll({
      attributes: ["id", "image"],
      where: {
        advertisement_id: 5,
        start_date: {
          [Sequelize.Op.lte]: formattedDate,
        },
        end_date: {
          [Sequelize.Op.gte]: formattedDate,
        },
        status: 1,
      },
      order: [["id", "DESC"]],
    });
    return res.status(200).json({
      success: true,
      advertises: advertisesData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
module.exports = {
  homePageAdvertise,
  specificCategoryAdversties,
  postDetailsAdverstises,
};
