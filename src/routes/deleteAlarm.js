const db = require('../persistence');

module.exports = async (req, res) => {
    await db.removeAlarm(req.params.name);
    res.sendStatus(200);
};
