const { post, fileuploads, category, user } = require("../models");
const db = require("../models");
const PaginationData = require("../utils/pagination");
const cloudinary = require("cloudinary").v2;

const { Op } = require("sequelize");

const createPostController = async (req, res, next) => {
  const { title, body, category_id, is_mukhya_samachar, author } = req.body;

  let transactionx = await db.sequelize.transaction();
  try {
    // console.log(req.body);
    const postData = {
      title: title,
      body: body,
      user_id: req.user_id,
      category_id: category_id,
      is_mukhya_samachar: is_mukhya_samachar,
      author: author,
      priority: 1,
      status: "active",
    };
    // Handle file upload and save in Cloudinary
    const fullImageUrl = req.body.featured_imageUrl;
    const fileName = fullImageUrl.substring(fullImageUrl.lastIndexOf("/") + 1);
    postData["featured_image"] = fileName;
    // Save file information to `fileuploads` table
    const fileInfo = await fileuploads.create({
      name: fileName, // Save the Cloudinary URL
      size: req.files.featured_image.size,
      type: req.files.featured_image.mimetype,
    });

    postData["featured_image_id"] = fileInfo.id; // Save the file info ID in the post data
    const data = await post.create(postData, { transaction: transactionx });
    postData["id"] = data.id;
    await transactionx.commit();
    return res.status(201).json({
      success: true,
      data: postData,
    });
  } catch (error) {
    console.log(error);
    if (transactionx) {
      await transactionx.rollback();
    }
    if (req.files && req.files.featured_image) {
      await cloudinary.uploader.destroy(req.files.featured_image.name); // Remove from Cloudinary if needed
    }
    return res.status(500).json({
      success: true,
      error: "Server error",
    });
  }
};

const getPostController = async (req, res, next) => {
  const { page = 0, size = 10 } = req.query;
  const { limit, offset } = PaginationData.getPagination(page, size);
  const { filter = "" } = req.query;
  try {
    const postData = await post.findAndCountAll({
      limit,
      offset,
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${filter}%`,
            },
          },
          {
            body: {
              [Op.like]: `%${filter}%`,
            },
          },
        ],
      },
      include: [
        {
          model: category,
          attributes: ["id", "name"],
        },
        {
          model: fileuploads,
          as: "featured_image",
          attributes: ["id", "name"],
        },
        {
          model: user,
          attributes: ["id", "fullname"],
        },
      ],
      attributes: { exclude: ["updated_at"] },
    });

    return res.status(200).json({
      success: true,
      data: postData.rows,
      totaldata: postData.count,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: true,
      error: "Server error",
    });
  }
};

const categoryPostController = async (req, res, next) => {
  try {
    const data = await category.findAll({
      where: {
        slug: req.params.slug,
      },
      include: [
        {
          model: post,
          as: "post",
          attributes: { exclude: ["updated_at"] },

          include: [
            {
              model: fileuploads,
              as: "featured_image",
              attributes: { exclude: ["updated_at"] },
            },
            {
              model: user,
              attributes: ["id", "fullname"],
            },
            // {
            //   model: user,
            //   as: "author_name",
            //   attributes: ["id", "fullname"],
            // },
          ],
        },
      ],
      attributes: { exclude: ["updated_at"] },
    });

    return res.status(200).json({
      success: true,
      data: data[0],
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      data: "server error",
    });
  }
};

const editPostController = async (req, res, next) => {
  const { title, body, category_id, is_mukhya_samachar, status } = req.body;
  let transactionx;

  try {
    transactionx = await db.sequelize.transaction();

    const editPostData = {
      title,
      body,
      user_id: req.user_id,
      category_id,
      is_mukhya_samachar,
      status,
    };



    const postData = await post.findOne({
      attributes: ["id", "title", "featured_image_id"],
      where: { id: req.params.id },
    });

    if (!postData) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!req.files) {
      await post.update(editPostData, {
        where: { id: req.params.id },
        transaction: transactionx,
      });

      await transactionx.commit();
      return res.status(200).json({ success: true, data: editPostData });
    }

        const fullImageUrl = req.body.featured_imageUrl;
        const fileName = fullImageUrl.substring(fullImageUrl.lastIndexOf("/") + 1);
        const imageId = postData.featured_image_id;
    const previousFile = await fileuploads.findOne({ where: { id: imageId }, transaction: transactionx });

    await fileuploads.update(
      {
        name: fileName,
        size: req.files.featured_image.size,
        type: req.files.featured_image.mimetype,
      },
      { where: { id: imageId }, transaction: transactionx }
    );

    await post.update(editPostData, { where: { id: req.params.id }, transaction: transactionx });

    await cloudinary.uploader.destroy(previousFile.name);
    editPostData["featured_image"] = fileName;

    await transactionx.commit();
    return res.status(200).json({ success: true, data: editPostData });

  } catch (error) {
    console.error(error);

    if (transactionx) await transactionx.rollback();

    if (req.files) {
      try {
        await cloudinary.uploader.destroy(req.files.featured_image.name);
      } catch (cloudinaryError) {
        console.error("Cloudinary Error:", cloudinaryError);
      }
    }

    return res.status(500).json({ success: false, error: "Server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const data = await post.destroy({
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
        message: "post not found",
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const detailPostController = async (req, res) => {
  try {
    const data = await post.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: category,
          attributes: ["id", "name"],
        },
        {
          model: fileuploads,
          as: "featured_image",
          attributes: ["id", "name"],
        },
        {
          model: user,
          attributes: ["id", "fullname"],
        },
        // {
        //   model: user,
        //   as: "author_name",
        //   attributes: ["id", "fullname"],
        // },
      ],
      attributes: { exclude: ["updated_at"] },
    });
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (erro) {
    console.log(erro);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  createPostController,
  getPostController,
  categoryPostController,
  editPostController,
  deletePost,
  detailPostController,
};
