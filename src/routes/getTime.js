const db = require('../persistence');

module.exports = async (req, res) => {
    let time = new Date();
    let offset = time.getHours() - 5;
    time.setHours(offset);
    let data =  {time: time.toLocaleString('en-us', {hour: '2-digit', minute: '2-digit', hour12: false}).replace(/:/g, '')};
    res.send(JSON.stringify(data));
    //res.send(time.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'}).replace(/:/g, '').replace(/\D/g, ''));
};