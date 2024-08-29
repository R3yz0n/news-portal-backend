const { client, transaction } = require("../models");
const PaginationData = require("../utils/pagination");

const { Sequelize, Op } = require("sequelize");

const createClientController = async (req, res, next) => {
  const { name, address, phone_no } = req.body;
  const clientData = {
    name: name,
    address: address,
    phone_no: phone_no,
    total: 0,
  };
  try {
    const data = await client.create(clientData);
    clientData["id"] = data.id;
    return res.status(201).json({
      success: true,
      data: clientData,
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
const getClientController = async (req, res, next) => {
  const { page = 0, size = 10 } = req.query;
  const { limit, offset } = PaginationData.getPagination(page, size);
  const { filter = "" } = req.query;
  try {
    const clientData = await client.findAndCountAll(
      {
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
            {
              address: {
                [Op.like]: "%" + filter + "%",
              },
            },
          ],
        },
      },
      {
        attributes: ["id", "name", "total", "phone_no", "address"],
        include: [
          {
            model: transaction,
            attributes: [],
          },
        ],
      }
    );

    return res.status(200).json({
      success: true,
      data: clientData.rows,
      totaldata: clientData.count,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "server error",
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    const data = await client.destroy({
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
        message: "client not found",
      });
    }
  } catch {
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: err });
  }
};

const editClient = async (req, res) => {
  try {
    const { name, address, phone_no } = req.body;
    const editedClientData = {
      name: name,
      address: address,
      phone_no: phone_no,
    };
    const data = await client.update(editedClientData, {
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json({
      success: true,
      data: editedClientData,
    });
  } catch (err) {
    if (err.original.code == "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Duplicate entry error" });
    }

    return res
      .status(500)
      .json({ error: "Internal Server Error", message: err });
  }
};

const getClientDetailsController = async (req, res, next) => {
  try {
    const data = await client.findOne({
      where: {
        id: req.params.id,
      },
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

const getAllClientList = async (req, res) => {
  try {
    const clientData = await client.findAll({
      attributes: [
        "id",
        "name",
        "phone_no",
        "total",
        [
          Sequelize.literal(
            "CAST((SELECT COALESCE(SUM(paid), 0) FROM transactions WHERE transactions.client_id = client.id) AS SIGNED)"
          ),
          "paid_amount",
        ],
      ],
    });
    return res.json({
      success: true,
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

module.exports = {
  createClientController,
  getClientController,
  deleteClient,
  editClient,
  getClientDetailsController,
  getAllClientList,
};
