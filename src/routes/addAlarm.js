const db = require('../persistence');

module.exports = async (req, res) => {
    const alarm = {
        name: req.body.name,
    };

    await db.storeAlarm(alarm);
    res.send(alarm);
};
