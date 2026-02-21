const { Sequelize, col, where } = require("sequelize");

const { transaction, client } = require("../models");
const db = require("../models");
// const PaginationData = require("../utils/pagination");
const createTransaction = async (req, res) => {
  let transactionx = await db.sequelize.transaction();
  try {
    const { client_id, paid } = req.body;
    const transactionData = {
      client_id: client_id,
      paid: paid,
    };
    const data = await transaction.create(transactionData, {
      transaction: transactionx,
    });
    const clientData = await client.findOne({ where: { id: client_id } });
    const transactionAmount = clientData.total_transaction + paid;
    const updatedClient = await client.update(
      { total_transaction: transactionAmount },
      {
        where: {
          id: client_id,
        },
      },
    );

    console.log(updatedClient);

    await transactionx.commit();
    return res.status(201).json({
      success: true,
      data: data,
    });
  } catch (err) {
    await transactionx.rollback();
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error", message: err });
  }
};

const transactionHistory = async (req, res) => {
  const id = req.params.client_id;
  const { start_date, end_date } = req.body;

  const startDate = new Date(start_date + "T00:00:00");

  const endDate = new Date(end_date + "T23:59:59");

  try {
    const clientData = await client.findOne({
      where: {
        id: id,
      },
      attributes: ["total"],
    });

    const transactionData = await transaction.findAll({
      where: {
        client_id: id,
        created_at: {
          [Sequelize.Op.between]: [startDate, endDate],
        },
      },
      attributes: {
        exclude: ["updated_at"],
      },
    });

    return res.status(200).json({
      success: true,
      data: { remaining_total: clientData.total, transactionData },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const getAllListTransactionclient = async (req, res) => {
  try {
    const clientData = await client.findAll({
      attributes: [
        "id",
        "name",
        "total",
        [Sequelize.literal("CAST(COALESCE(SUM(transactions.paid), 0) AS UNSIGNED)"), "paid_amount"],
      ],
      include: [
        {
          model: transaction,
          attributes: [],
        },
      ],
      group: ["client.id"],
    });
    return res.json({
      data: clientData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      succuss: false,
      error: "server error",
    });
  }
};

const getAllClientsTotalPaidAmount = async (req, res) => {
  try {
    const results = await transaction.findAll({
      attributes: ["client_id", [Sequelize.literal("SUM(paid)"), "totalPaidAmount"]],
      include: [
        {
          model: client,
          attributes: ["id", "name", "total"],
        },
      ],
      group: ["client_id"],
    });

    const clientTotalPaidAmounts = results.map((result) => ({
      id: result.client.id,
      name: result.client.name,
      total: result.client.total,
      totalPaidAmount: parseInt(result.getDataValue("totalPaidAmount") || 0),
      dues: result.client.total - result.getDataValue("totalPaidAmount"),
    }));

    return res.json({
      success: true,
      data: clientTotalPaidAmounts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

module.exports = {
  createTransaction,
  transactionHistory,
  getAllListTransactionclient,
  getAllClientsTotalPaidAmount,
};
