const { Sequelize, Op } = require("sequelize");
const {
  advertises,
  client,
  advertisement,
  transaction,
  fileuploads,
} = require("../models");
const db = require("../models");
const removeFile = require("../utils/remove_file");
const PaginationData = require("../utils/pagination");
//calculating difference in months
function calculateMonthDifference(startDate, endDate) {
  const totalMonthDifference =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    (endDate.getDate() - startDate.getDate()) /
      new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();

  const roundedMonthDifference = Math.ceil(totalMonthDifference * 10) / 10;

  return roundedMonthDifference;
}

// const createAdvertisesController = async (req, res) => {
//   let transactionx = await db.sequelize.transaction();
//   try {
//     const {
//       name,
//       description,
//       start_date,
//       end_date,
//       discount,
//       client_id,
//       paid_amount,
//       advertisement_id,
//       where_to_display,
//     } = req.body;

//     const adventisementData = await advertisement.findOne({
//       where: { id: advertisement_id },
//       attributes: ["rate"],
//     });

//     let discountPrice = parseInt(discount ? discount : 0);
//     const startDate = new Date(start_date);
//     const endDate = new Date(end_date);

//     let totalMonthDifference = calculateMonthDifference(startDate, endDate);

//     let total_price = parseInt(
//       totalMonthDifference * adventisementData.rate - discountPrice
//     );
//     if (total_price < 0) {
//       removeFile(req.file.filename);
//       return res.status(422).json({
//         success: false,
//         error: {
//           discount: ["Total price must be more than discount amount"],
//         },
//       });
//     }
//     const advertisesData = {
//       name: name,
//       description: description,
//       advertisement_id: advertisement_id,
//       start_date: start_date,
//       end_date: end_date,
//       status: 1,
//       client_id: client_id,
//       user_id: req.user_id,
//       image: req.file.filename,
//       discount: discountPrice,
//       total_price: total_price,
//       where_to_display: where_to_display,
//     };
//     const clientData = await client.findOne({
//       where: {
//         id: client_id,
//       },
//     });
//     const grandTotal = parseInt(clientData.total) + total_price;

//     const data = await advertises.create(advertisesData, {
//       transaction: transactionx,
//     });

//     const data1 = await client.update(
//       { total: grandTotal },
//       {
//         where: {
//           id: client_id,
//         },
//       },
//       { transaction: transactionx }
//     );
//     if (paid_amount > 0) {
//       const data2 = await transaction.create(
//         { client_id: client_id, paid: paid_amount },
//         {
//           transaction: transactionx,
//         }
//       );
//       if (data1 && data && data2) {
//         await transactionx.commit();
//         return res.status(201).json({
//           success: true,
//           data: advertisesData,
//         });
//       }
//       await transactionx.rollback();
//       if (req.file) {
//         removeFile(req.file.filename);
//       }
//       return res.status(500).json({
//         success: false,
//         error: "Server error",
//       });
//     }
//     if (data1 && data) {
//       await transactionx.commit();
//       return res.status(201).json({
//         success: true,
//         data: advertisesData,
//       });
//     }

//     await transactionx.rollback();
//     if (req.file) {
//       removeFile(req.file.filename);
//     }

//     return res.status(500).json({
//       success: false,
//       error: "Server error",
//     });
//   } catch (err) {
//     console.log(err);
//     await transactionx.rollback();
//     if (req.file) {
//       removeFile(req.file.filename);
//     }

//     return res
//       .status(500)
//       .json({ error: "Internal Server Error", message: err });
//   }
// };

const createAdvertisesController = async (req, res) => {
  let transactionx;

  try {
    transactionx = await db.sequelize.transaction();

    const {
      name,
      description,
      start_date,
      end_date,
      discount,
      client_id,
      paid_amount,
      advertisement_id,
      where_to_display,
    } = req.body;

    // Retrieve advertisement rate
    const advertisementData = await advertisement.findOne({
      where: { id: advertisement_id },
      attributes: ["rate"],
    });

    if (!advertisementData) {
      return res
        .status(404)
        .json({ success: false, error: "Advertisement not found" });
    }

    const discountPrice = parseInt(discount || 0);
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Calculate total month difference
    const totalMonthDifference = calculateMonthDifference(startDate, endDate);

    // Calculate total price with discount
    let total_price = parseInt(
      totalMonthDifference * advertisementData.rate - discountPrice
    );

    if (total_price < 0) {
      if (req.files && req.files.image && req.files.image.public_id) {
        await cloudinary.uploader.destroy(req.files.image.public_id);
      }
      return res.status(422).json({
        success: false,
        error: {
          discount: ["Total price must be more than the discount amount"],
        },
      });
    }

    // Handle file upload and save in Cloudinary
    const fullImageUrl = req.body.imageUrl; // Assuming imageUrl is passed in the request body
    const fileName = fullImageUrl.substring(fullImageUrl.lastIndexOf("/") + 1);

    // Save file information to `fileuploads` table
    const fileInfo = await fileuploads.create(
      {
        name: fileName, // Save the Cloudinary file name
        size: req.files.image.size, // Assuming file size is available
        type: req.files.image.mimetype, // Assuming MIME type is available
      },
      { transaction: transactionx }
    );

    // Prepare advertisement data
    const advertisesData = {
      name,
      description,
      advertisement_id,
      start_date,
      end_date,
      status: 1,
      client_id,
      user_id: req.user_id,
      image: fileInfo.id, // Store the file ID
      discount: discountPrice,
      total_price,
      where_to_display,
    };

    // Retrieve client data
    const clientData = await client.findOne({
      where: { id: client_id },
    });

    if (!clientData) {
      await transactionx.rollback();
      if (req.files && req.files.image && req.files.image.public_id) {
        await cloudinary.uploader.destroy(req.files.image.public_id);
      }
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }

    // Calculate grand total for the client
    const grandTotal = parseInt(clientData.total) + total_price;

    // Create new advertisement entry
    const advertisementEntry = await advertises.create(advertisesData, {
      transaction: transactionx,
    });

    // Update client total
    await client.update(
      { total: grandTotal },
      { where: { id: client_id }, transaction: transactionx }
    );

    // Handle payment if paid_amount is provided
    if (paid_amount > 0) {
      await transaction.create(
        { client_id, paid: paid_amount },
        { transaction: transactionx }
      );
    }

    // Commit transaction if successful
    await transactionx.commit();
    return res.status(201).json({ success: true, data: advertisesData });
  } catch (err) {
    console.error(err);
    if (transactionx) await transactionx.rollback();
    if (req.files && req.files.image && req.files.image.public_id) {
      try {
        await cloudinary.uploader.destroy(req.files.image.public_id);
      } catch (cloudinaryError) {
        console.error("Cloudinary Error:", cloudinaryError);
      }
    }
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

const getListAdvertisesController = async (req, res) => {
  const { page = 0, size = 10 } = req.query;
  const { limit, offset } = PaginationData.getPagination(page, size);
  const { filter = "" } = req.query;
  try {
    const listAdverstises = await advertises.findAndCountAll({
      limit,
      offset,
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${filter}%`,
            },
          },
        ],
      },
      include: [
        {
          model: client,
          attributes: ["id", "name"],
        },
      ],
    });
    return res.status(200).json({
      success: true,
      data: listAdverstises.rows,
      totaldata: listAdverstises.count,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

const getListAdvertisesClientController = async (req, res) => {
  const clientId = req.params.clientId;
  const listAdverstises = await advertises.findAll({
    where: { client_id: clientId },
    attributes: {
      exclude: ["user_id", "advertisement_id"],
    },
    include: [
      {
        model: advertisement,
        attributes: ["id", "type"],
      },
    ],
  });
  const clientData = await client.findOne({
    where: { id: clientId },
    attributes: ["total", "name"],
  });
  const totalAmount = clientData.total;
  const transactionData = await transaction.findOne({
    where: { client_id: clientId },
    attributes: [[Sequelize.fn("sum", Sequelize.col("paid")), "total_paid"]],
  });
  const totalPaid = totalAmount - transactionData.dataValues.total_paid;
  const payableAmount = totalPaid;

  return res.status(200).json({
    success: true,
    data: {
      advertisement: listAdverstises,
      payable_amount: payableAmount,
      total_amount: totalAmount,
      name: clientData.name,
    },
  });
};

const updateAdvertisesController = async (req, res) => {
  let transactionx;

  try {
    transactionx = await db.sequelize.transaction();
    const advertisesId = req.params.id;
    const { name, description, advertisement_id } = req.body;

    // Find the existing advertisement
    const advertisesData = await advertises.findOne({
      where: { client_id: advertisesId },
      attributes: ["id", "image"],
    });

    if (!advertisesData) {
      return res
        .status(404)
        .json({ success: false, error: "Advertisement not found" });
    }

    const advertisesUpdateData = {
      name: name,
      description: description,
      advertisement_id: advertisement_id,
    };

    let fileInfo;

    // If there's a new file in the request, update it
    if (req.files) {
      const fullImageUrl = req.body.imageUrl; // Assuming imageUrl is passed in the request body
      const fileName = fullImageUrl.substring(
        fullImageUrl.lastIndexOf("/") + 1
      );

      // Save new file information to `fileuploads` table
      fileInfo = await fileuploads.create(
        {
          name: fileName, // Save the new Cloudinary file name
          size: req.files.image.size, // Assuming file size is available
          type: req.files.image.mimetype, // Assuming MIME type is available
        },
        { transaction: transactionx }
      );

      advertisesUpdateData["image"] = fileInfo.id; // Update the advertisement's image with new file info
    }

    // Update the advertisement data
    const data = await advertises.update(advertisesUpdateData, {
      where: { client_id: advertisesId },
      transaction: transactionx,
    });

    if (data) {
      // If there's a new image, remove the old image from Cloudinary and `fileuploads`
      if (req.file) {
        const oldFile = await fileuploads.findOne({
          where: { id: advertisesData.image },
        });
        if (oldFile) {
          await cloudinary.uploader.destroy(oldFile.name); // Delete the old file from Cloudinary
          await fileuploads.destroy({
            where: { id: oldFile.id },
            transaction: transactionx,
          }); // Delete old file from `fileuploads` table
        }
      }

      // Commit the transaction if everything succeeds
      await transactionx.commit();

      return res.status(200).json({
        success: true,
        data: advertisesUpdateData,
      });
    }

    // If the update failed, remove the new file if it exists
    if (req.file) {
      await cloudinary.uploader.destroy(fileInfo.name);
    }

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  } catch (error) {
    console.log(error);

    // Rollback the transaction in case of an error
    if (transactionx) await transactionx.rollback();

    // Delete the uploaded file if it exists
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename);
    }

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

const getAdvertisesDetailController = async (req, res) => {
  try {
    const data = await advertises.findOne({
      where: { id: req.params.id },
      attributes: ["id", "name", "description", "advertisement_id", "image"],
    });
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Sever Error",
    });
  }
};

const getallAdvertiseClientController = async (req, res) => {
  try {
    const { page = 0, size = 10 } = req.query;
    const { limit, offset } = PaginationData.getPagination(page, size);
    const { filter = "" } = req.query;
    const clientData = await client.findAndCountAll({
      limit,
      offset,
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + filter + "%",
            },
          },
          {
            phone_no: {
              [Op.like]: "%" + filter + "%",
            },
          },
        ],
      },
      attributes: [
        "id",
        "name",
        "total",
        "phone_no",
        [
          Sequelize.literal(
            "CAST((SELECT COALESCE(SUM(paid), 0) FROM transactions WHERE transactions.client_id = client.id) AS SIGNED)"
          ),
          "paid_amount",
        ],
      ],
    });

    return res.status(200).json({
      success: true,
      data: clientData.rows,
      totaldata: clientData.count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

module.exports = {
  createAdvertisesController,
  getListAdvertisesController,
  getListAdvertisesClientController,
  updateAdvertisesController,
  getAdvertisesDetailController,
  getallAdvertiseClientController,
};
