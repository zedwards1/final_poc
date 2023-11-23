const db = require('../persistence');

module.exports = async (req, res) => {
    await db.updateAlarm(req.params.id, {
        name: req.body.name,
    });
    const alarm = await db.getAlarm(req.params.id);
    res.send(alarm);
};
