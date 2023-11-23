const db = require('../persistence');

module.exports = async (req, res) => {
    const time = new Date().toLocaleTimeString();
    res.send(time);
};