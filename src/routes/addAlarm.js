const db = require('../persistence');
const {v4 : uuid} = require('uuid');

module.exports = async (req, res) => {
    const alarm = {
        id: uuid(),
        name: req.body.name,
    };

    await db.storeAlarm(alarm);
    res.send(alarm);
};
