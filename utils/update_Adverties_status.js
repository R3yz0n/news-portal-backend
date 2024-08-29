const schedule = require('node-schedule');
const { Sequelize,Op } = require("sequelize");
const { advertises } = require('../models'); // Import your Sequelize model



const updateStatusJob = schedule.scheduleJob('0 0 * * *', async () => {

  try {
    const currentDate = new Date();

    // Find records where end_date is yesterday or earlier and status is still 1
    const expiredAdvertises = await advertises.findAll({
      where: {
        status: 1,
        end_date: {
          [Op.lt]: currentDate,
        },
      },
    });

    if (expiredAdvertises.length > 0) {
      // Update status to 0 for each expired record
      await Promise.all(expiredAdvertises.map(async (advertise) => {
        await advertise.update({ status: 0 });
      }));

      console.log(`Updated ${expiredAdvertises.length} advertises status to 0.`);
    }
  } catch (error) {
    console.error('Error updating statuses:', error);
  }
});

// Run the job immediately when the application starts
updateStatusJob.invoke();

// Log when the job is canceled (useful for debugging or stopping the application)
process.on('SIGINT', () => {
  updateStatusJob.cancel();
  process.exit();
});

module.exports={updateStatusJob}