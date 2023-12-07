const db = require('../persistence');

module.exports = async (req, res) => {
    const offset = await db.getOffset();
    let time = new Date();
    const hours = time.getHours() - 5 + offset[0]['hours'];
    const minutes = time.getMinutes() + offset[0]['minutes'];
    time.setHours(hours);
    time.setMinutes(minutes);
    const object = { time: time.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit', hour12: false}).replace(/:/g, '').replace(/\D/g, '') }
    res.send(object);
};