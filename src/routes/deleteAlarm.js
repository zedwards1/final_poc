const db = require('../persistence');

module.exports = async (req, res) => {
    await db.removeAlarm(req.params.id);
    res.sendStatus(200);
};
