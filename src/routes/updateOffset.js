const db = require('../persistence');

module.exports = async (req, res) => {
    await db.updateOffset({
        hours: req.body.hours,
        minutes: req.body.minutes,
    });
    const offset = await db.getOffset();
    res.send(offset);
};