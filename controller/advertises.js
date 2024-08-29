const { Sequelize, Op } = require("sequelize");
const { advertises, client, advertisement, transaction } = require("../models");
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

const createAdvertisesController = async (req, res) => {
  let transactionx = await db.sequelize.transaction();
  try {
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

    const adventisementData = await advertisement.findOne({
      where: { id: advertisement_id },
      attributes: ["rate"],
    });

    let discountPrice = parseInt(discount ? discount : 0);
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    let totalMonthDifference = calculateMonthDifference(startDate, endDate);

    let total_price = parseInt(
      totalMonthDifference * adventisementData.rate - discountPrice
    );
    if (total_price < 0) {
      removeFile(req.file.filename);
      return res.status(422).json({
        success: false,
        error: {
          discount: ["Total price must be more than discount amount"],
        },
      });
    }
    const advertisesData = {
      name: name,
      description: description,
      advertisement_id: advertisement_id,
      start_date: start_date,
      end_date: end_date,
      status: 1,
      client_id: client_id,
      user_id: req.user_id,
      image: req.file.filename,
      discount: discountPrice,
      total_price: total_price,
      where_to_display: where_to_display,
    };
    const clientData = await client.findOne({
      where: {
        id: client_id,
      },
    });
    const grandTotal = parseInt(clientData.total) + total_price;

    const data = await advertises.create(advertisesData, {
      transaction: transactionx,
    });

    const data1 = await client.update(
      { total: grandTotal },
      {
        where: {
          id: client_id,
        },
      },
      { transaction: transactionx }
    );
    if (paid_amount > 0) {
      const data2 = await transaction.create(
        { client_id: client_id, paid: paid_amount },
        {
          transaction: transactionx,
        }
      );
      if (data1 && data && data2) {
        await transactionx.commit();
        return res.status(201).json({
          success: true,
          data: advertisesData,
        });
      }
      await transactionx.rollback();
      if (req.file) {
        removeFile(req.file.filename);
      }
      return res.status(500).json({
        success: false,
        error: "Server error",
      });
    }
    if (data1 && data) {
      await transactionx.commit();
      return res.status(201).json({
        success: true,
        data: advertisesData,
      });
    }

    await transactionx.rollback();
    if (req.file) {
      removeFile(req.file.filename);
    }

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  } catch (err) {
    console.log(err);
    await transactionx.rollback();
    if (req.file) {
      removeFile(req.file.filename);
    }

    return res
      .status(500)
      .json({ error: "Internal Server Error", message: err });
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
  try {
    const advertisesId = req.params.id;
    const { name, description, advertisement_id } = req.body;
    const advertisesData = await advertises.findOne({
      where: { id: advertisesId },
      attributes: ["id", "image"],
    });

    const advertisesUpdateData = {
      name: name,
      description: description,
      advertisement_id: advertisement_id,
    };
    if (req.file) {
      advertisesUpdateData["image"] = req.file.filename;
    }

    const data = await advertises.update(advertisesUpdateData, {
      where: { id: advertisesId },
    });

    if (data) {
      if (req.file) removeFile(advertisesData.image);
      return res.status(200).json({
        success: true,
        data: advertisesUpdateData,
      });
    }
    if (req.file) {
      removeFile(req.file.filename);
    }

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  } catch (error) {
    console.log(error);
    if (req.file) {
      removeFile(req.file.filename);
    }

    return res.status(500).json({
      success: false,
      error: "Server error",
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
