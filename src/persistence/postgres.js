const waitPort = require('wait-port');
const fs = require('fs');
const { Client } = require('pg');

const {
    POSTGRES_HOST: HOST,
    POSTGRES_HOST_FILE: HOST_FILE,
    POSTGRES_USER: USER,
    POSTGRES_USER_FILE: USER_FILE,
    POSTGRES_PASSWORD: PASSWORD,
    POSTGRES_PASSWORD_FILE: PASSWORD_FILE,
    POSTGRES_DB: DB,
    POSTGRES_DB_FILE: DB_FILE,
} = process.env;

let client;

async function init() {
    const host = HOST_FILE ? fs.readFileSync(HOST_FILE) : HOST;
    const user = USER_FILE ? fs.readFileSync(USER_FILE) : USER;
    const password = PASSWORD_FILE ? fs.readFileSync(PASSWORD_FILE, 'utf8') : PASSWORD;
    const database = DB_FILE ? fs.readFileSync(DB_FILE) : DB;

    await waitPort({ 
        host, 
        port: 5432,
        timeout: 10000,
        waitForDns: true,
    });

    client = new Client({
        host,
        user,
        password,
        database
    });

    return client.connect().then(async () => {
        console.log(`Connected to postgres db at host ${HOST}`);
        // Run the SQL instruction to create the table if it does not exist
        await client.query('CREATE TABLE IF NOT EXISTS alarm_table (id varchar(36), name varchar(255))');
        console.log('Connected to db and created table alarm_table if it did not exist');
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });
}

// Get all alarms from the table
async function getAlarms() {
  return client.query('SELECT * FROM alarm_table').then(res => {
    return res.rows.map(row => ({
      id: row.id,
      name: row.name
    }));
  }).catch(err => {
    console.error('Unable to get alarms:', err);
  });
}


// End the connection
async function teardown() {
  return client.end().then(() => {
    console.log('Client ended');
  }).catch(err => {
    console.error('Unable to end client:', err);
  });
}
  
// Get one alarm by id from the table
async function getAlarm(id) {
    return client.query('SELECT * FROM alarm_table WHERE id = $1', [id]).then(res => {
      return res.rows.length > 0 ? res.rows[0] : null;
    }).catch(err => {
      console.error('Unable to get alarm:', err);
    });
}
  
// Store one alarm in the table
async function storeAlarm(alarm) {
    return client.query('INSERT INTO alarm_table(id, name) VALUES($1, $2)', [alarm.id, alarm.name]).then(() => {
      console.log('Stored alarm:', alarm);
    }).catch(err => {
      console.error('Unable to store alarm:', err);
    });
}
  
// Update one alarm by id in the table
async function updateAlarm(id, alarm) {
    return client.query('UPDATE alarm_table SET name = $1 WHERE id = $2', [alarm.name, id]).then(() => {
      console.log('Updated alarm:', alarm);
    }).catch(err => {
      console.error('Unable to update alarm:', err);
    });
}
  
// Remove one alarm by id from the table
async function removeAlarm(id) {
    return client.query('DELETE FROM alarm_table WHERE id = $1', [id]).then(() => {
      console.log('Removed alarm:', id);
    }).catch(err => {
      console.error('Unable to remove alarm:', err);
    });
}
  
module.exports = {
  init,
  teardown,
  getAlarms,
  getAlarm,
  storeAlarm,
  updateAlarm,
  removeAlarm,
};
