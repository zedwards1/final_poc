const db = require('../persistence');
module.exports = async (req, res) => {
    const alarms = await db.getNextAlarm();
    const hours = new Date().getHours() - 5;
    const minutes = new Date().getMinutes();
    const military = (hours * 100) + minutes;
    let min = 2500;
    for(let i=0; i<alarms.length; i++){
        let diff = alarms[i]-military;
        if(diff > 0 && diff < min){
            min = alarms[i];
        }
    }
    const result = {time: min}
    res.send(result);
};