const db = require('../persistence');

module.exports = async (req, res) => {
    await db.updateAlarm({
        name: req.body.name,
    });
    const alarm = await db.getAlarm(req.params.name);
    res.send(alarm);
};
