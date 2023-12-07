const db = require('../persistence');

module.exports = async (req, res) => {
    const offset = await db.getOffset();
    res.send(offset[0]);
};