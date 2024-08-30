const { post, fileuploads, category, user } = require("../models");
const db = require("../models");
const PaginationData = require("../utils/pagination");

const removeFile = require("../utils/remove_file");
const { Op } = require("sequelize");

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
    const file = req.files.featured_image;
    console.log(file);
    
    const fileInfo = await fileuploads.create({
      name: file.name,
      size: file.size,  
      type: file.mimetype,
    }); 
    postData["featured_image_id"] = fileInfo.id;
    postData["featured_image"] = file.filename;
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
    removeFile(req.files.filename);
    return res.status(500).json({
      success: true,
      error: "Server error",
    });
  }
};

//   try {
//     const categories = await category.findAll({
//     //   where: {
//     //     name: req.params.name,
//     //   },
//       //   include: [
//       //     {
//       //       model: post,
//       //       as: "post",
//       //     },
//       //   ],
//     });
//     console.log(categories);
//     return res.status(200).json({
//       success: true,
//       data: categories,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       success: true,
//       error: "Server error",
//     });
//   }
// };

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
  let transactionx = await db.sequelize.transaction();
  const file = req.file;

  const { title, body, category_id, is_mukhya_samachar, status } = req.body;
  const editPostData = {
    title: title,
    body: body,
    user_id: req.user_id,
    category_id: category_id,
    is_mukhya_samachar: is_mukhya_samachar,
    status: status,
  };
  try {
    const data = await post.findAll({
      attributes: ["id", "title", "featured_image_id"],
      where: {
        id: req.params.id,
      },
    });

    if (data.length == 0) {
      return res.status(404).json({
        message: "Post  not found",
      });
    }
    if (file === undefined) {
      let editedData = await post.update(
        editPostData,
        {
          where: {
            id: req.params.id,
          },
        },
        { transaction: transactionx }
      );

      await transactionx.commit();
      editedData = editPostData;
      return res.status(200).json({
        success: true,
        data: editPostData,
      });
    }

    const imageId = data[0].featured_image_id;
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
    const editedData = await post.update(
      editPostData,
      {
        where: {
          id: req.params.id,
        },
      },
      { transaction: transactionx }
    );
    if ((fileInfo[0] == 1 && editedData[0] == 1) || editedData[0] == 0) {
      removeFile(fileName[0].name);
      editPostData["featured_image"] = req.file.filename;
      await transactionx.commit();
      return res.status(200).json({
        success: true,
        data: editPostData,
      });
    }
    await transactionx.rollback();
    removeFile(req.file.filename);
    return res.status(500).json({
      success: false,
      error: "Server error",
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
