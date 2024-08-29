const { advertises, client, post, transaction } = require("../models");
const getAllInformationController = async (req, res) => {
  try {
    const totalAdvertiseActiveCount = await advertises.count({
      where: {
        status: true,
      },
    });
    const totalAdvertiseInActiveCount = await advertises.count({
      where: {
        status: false,
      },
    });

    const totalClient = await client.count();
    const totalPost = await post.count();
    return res.status(200).json({
      success: true,
      data: {
        advertise_active: totalAdvertiseActiveCount,
        advertise_inactive: totalAdvertiseInActiveCount,
        client: totalClient,
        post: totalPost,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

module.exports = {
  getAllInformationController,
};
