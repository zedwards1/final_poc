const express = require('express');
const app = express();
const db = require('./persistence');
const getAlarms = require('./routes/getAlarms');
const addAlarm = require('./routes/addAlarm');
const updateAlarm = require('./routes/updateAlarm');
const deleteAlarm = require('./routes/deleteAlarm');
const getTime = require('./routes/getTime');

app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.get('/time', getTime);
app.get('/alarms', getAlarms);
app.post('/alarms', addAlarm);
app.put('/alarms/:name', updateAlarm);
app.delete('/alarms/:name', deleteAlarm);

db.init().then(() => {
    app.listen(3000, () => console.log('Listening on port 3000'));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
