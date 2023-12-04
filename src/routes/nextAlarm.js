const db = require('../persistence');
module.exports = async (req, res) => {
    const alarms = await db.getNextAlarm();
    let hours = new Date().getHours()-5;
    if(hours < 0){
        hours+=24;
    }
    const minutes = new Date().getMinutes();
    const military = (hours * 100) + minutes;
    let min = 2500;
    let minAlarm=2500;
    for(let i=0; i<alarms.length; i++){
        let diff = parseInt(alarms[i].toString().replace(/:/g, ''))-military;
        if(diff > 0 && diff < min){
            minAlarm = alarms[i];
            min=diff;
        }
    }

    if(minAlarm==2500){
        for(let i=0; i<alarms.length; i++){
            let diff = parseInt(alarms[i].toString().replace(/:/g, ''))-military;
            if(diff < min){
                min=diff;
                minAlarm = alarms[i];
            }
        }
    }
    const result = {time: minAlarm.toString()}
    res.send(JSON.stringify(result));
};