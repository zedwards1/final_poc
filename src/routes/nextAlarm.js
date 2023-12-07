const db = require('../persistence');
module.exports = async (req, res) => {
    const alarms = await db.getNextAlarm();
    const offset = await db.getOffset();
    let time = new Date();
    const hours = time.getHours() - 5 + offset[0]['hours'];
    const minutes = time.getMinutes() + offset[0]['minutes'];
    time.setHours(hours);
    time.setMinutes(minutes);
    const military = parseInt(time.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit', hour12: false}).replace(/:/g, '').replace(/\D/g, ''));
    console.log(military);
    let min = 2500;
    let minAlarm=2500;
    for(let i=0; i<alarms.length; i++){
        let diff = parseInt(alarms[i].toString().replace(/:/g, ''))-military;
        if(diff > 0 && diff < min){
            minAlarm = alarms[i];
            min=diff;
        }
    }

    if(minAlarm===2500){
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