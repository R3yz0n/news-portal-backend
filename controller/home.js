const { Sequelize } = require("sequelize");
const {
  category,
  post,
  fileuploads,
  advertisement,
  advertises,
  sequelize,
} = require("../models");

// const fileuploads = require("../models/fileuploads");

const homePagePost = async (req, res) => {
  try {
    const limitPerCategory = 5;
    let parsedDate = new Date();
    const formattedDate = `${parsedDate.getFullYear()}-${
      parsedDate.getMonth() + 1
    }-${parsedDate.getDate()}`;

    const advertisesData = await advertises.findAll({
      attributes: ["id", "image"],
      where: {
        start_date: {
          [Sequelize.Op.lte]: formattedDate,
        },
        end_date: {
          [Sequelize.Op.gte]: formattedDate,
        },
        status: 1,
      },
      order: [["id", "DESC"]],
      include: [
        {
          model: advertisement,
          attributes: ["id", "type"],
        },
      ],
    });

    const headingSamachar = await post.findAll({
      limit: 4,
      order: [Sequelize.literal("RAND()"), ["created_at", "DESC"]],
      where: {
        is_mukhya_samachar: 1,
      },
      attributes: ["id", "title"],
    });

    const categories = await category.findAll({
      include: [
        {
          model: post,
          include: [
            {
              model: fileuploads,
              as: "featured_image",
              attributes: { exclude: ["updated_at", "size", "type"] },
            },
          ],
          as: "post",
          limit: limitPerCategory,
          order: [["created_at", "DESC"]],
          attributes: { exclude: ["updated_at"] },
        },
      ],
      attributes: { exclude: ["updated_at"] },
    });

    const tajaSamachar = [];

    for (const news of categories) {
      const newsList = news.post;

      if (newsList.length > 0) {
        const sortedNewsList = newsList.sort(
          (a, b) => b.created_at - a.created_at
        );
        const value = sortedNewsList[0];
        tajaSamachar.push(value);
      }
    }

    const newsList = tajaSamachar.sort((a, b) => b.created_at - a.created_at);

    // Now tajaSamachar array contains the sorted news items based on created_at in descending order

    return res.status(200).json({
      success: true,
      data: {
        headline_news: headingSamachar,
        post: categories,
        taja_samachar: newsList,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "server error",
    });
  }
};

module.exports = {
  homePagePost: homePagePost,
};
