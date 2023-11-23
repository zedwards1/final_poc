const db = require('../persistence');

module.exports = async (req, res) => {
    const alarms = await db.getAlarms();
    res.send(alarms);
};
