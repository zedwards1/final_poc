function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
            <Row>
                <TimeCard />
            </Row>
            <Row style={{ paddingTop: 10, paddingBottom: 10}}>
                <Col md={{ offset: 3, span: 6 }}>
                    <AlarmsCard />
                </Col>
            </Row>
        </Container>
    );
}

function AlarmsCard() {
    const [alarms, setAlarms] = React.useState([]);

    React.useEffect(() => {
        fetch('/alarms')
            .then((r) => r.json())
            .then((data) => {
                const newData = data.map((alarm) => {
                    const military = alarm['name'].replace(/:/g, '');
                    const hours = Math.floor(military/100);
                    const minutes = military % 100;
                    let time = new Date();
                    time.setHours(hours);
                    time.setMinutes(minutes);
                    console.log(time.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'}));
                    return { name: time.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'}) }
                })
                setAlarms(newData);
            });
    }, []);

    const onAlarmAdd = React.useCallback(
        (alarm) => {
            if(!alarms.find(item => item.name === alarm.name)){
                setAlarms([...alarms, alarm]);
            }
        }, [alarms]);

    const onAlarmUpdate = React.useCallback(
        (alarm) => {
            const index = alarms.findIndex((i) => i.name === alarm.name);
            setAlarms([
                ...alarms.slice(0, index),
                alarm,
                ...alarms.slice(index + 1),
            ]);
        },
        [alarms],
    );

    const onAlarmRemoval = React.useCallback(
        (alarm) => {
            const index = alarms.findIndex((i) => i.name === alarm.name);
            setAlarms([...alarms.slice(0, index), ...alarms.slice(index + 1)]);
        },
        [alarms],
    );

    if (alarms === null) return 'Loading...';
    
    return (
        <React.Fragment>
            {alarms.length < 10 ? (<AddAlarmForm onAlarmAdd={onAlarmAdd}/>) 
            : (<p className="text-center">MAX NUMBER OF ALARMS REACHED!!!</p>)}
            {alarms.length === 0 && (
                <p className="text-center">No alarms yet! Add one above!</p>
            )}
            {alarms.map((alarm) => (
                <AlarmDisplay
                    alarm={alarm}
                    key={alarm.name}
                    onAlarmRemoval={onAlarmRemoval}
                />
            ))}
        </React.Fragment>
    );
}

function TimeCard() {
    const { Form, InputGroup, Button, ButtonGroup, Row, Col, Container } = ReactBootstrap;
    
    const [offset, setOffset] = React.useState({ hours: 0, minutes: 0});

    React.useEffect(() => {
        fetch('/offset')
            .then((r) => r.json())
            .then(setOffset);
    }, []);

    const [date, setDate] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => {
            let current_date = new Date();
            const minutes = current_date.getMinutes();
            const hours = current_date.getHours();
            current_date.setHours(hours + offset['hours']);
            current_date.setMinutes(minutes + offset['minutes']);
            setDate(current_date);
        }, 1000)

        return function cleanup(){
            clearInterval(timer)
        }
    })

    React.useEffect(() => {
        let current_date = new Date();
        const minutes = current_date.getMinutes();
        const hours = current_date.getHours();
        current_date.setHours(hours + offset['hours']);
        current_date.setMinutes(minutes + offset['minutes']);
        setDate(current_date);

        fetch('/offset', {
            method: 'PUT',
            body: JSON.stringify({ hours: offset['hours'], minutes: offset['minutes'] }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then((r) => r.json());

    }, [offset])

    const adjustTime = (op, type) => {
        setOffset((prevOffset) => {
            const newOffset = { ...prevOffset };

            if (op === 'add'){
                newOffset[type]++;
                console.log(newOffset);
            }else if(op === 'sub'){
                newOffset[type]--;
                console.log(newOffset);
            }

            return newOffset
        })
    }

    return (
        <Container>
            <Row gutter={1}>
                <Col>
                    <p className="text-center"> Time : {date.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})}</p>
                </Col>
            </Row>
            <p className="text-center"> Date : {date.toLocaleDateString()}</p>
          <Row className="justify-content-center">
            <Col xs={4} className="text-center">
                <p className="text-center">
                    Hours
                </p>
                <ButtonGroup vertical>
                    <Button variant="primary" onClick={() => adjustTime('add', 'hours')}>+</Button>
                    <Button onClick={() => adjustTime('sub', 'hours')}>-</Button>
                </ButtonGroup>
            </Col>
            <Col xs={4} className="text-center">
                <p className="text-center">
                    Minutes
                </p>
                <ButtonGroup vertical>
                    <Button variant="primary" onClick={() => adjustTime('add', 'minutes')}>+</Button>
                    <Button onClick={() => adjustTime('sub', 'minutes')}>-</Button>
                </ButtonGroup>
            </Col>
          </Row>
        </Container>
    );
}

function AddAlarmForm( { onAlarmAdd }) {
    const { Form, InputGroup, Button } = ReactBootstrap;

    const [newAlarm, setNewAlarm] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);

    const submitNewAlarm = (e) => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/alarms', {
            method: 'POST',
            body: JSON.stringify({ name: newAlarm }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((r) => r.json())
            .then((alarm) => {
                setSubmitting(false);
                setNewAlarm('');
                const military = alarm['name'].replace(/:/g, '');
                const hours = Math.floor(military/100);
                const minutes = military % 100;
                let time = new Date();
                time.setHours(hours);
                time.setMinutes(minutes);
                console.log(time.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'}));
                onAlarmAdd({name: time.toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit'})});
            });
    };

    return (
        <Form onSubmit={submitNewAlarm}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={newAlarm}
                    onChange={(e) => setNewAlarm(e.target.value)}
                    type="time"
                    aria-describedby="basic-addon1"
                />
                <InputGroup.Append>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!newAlarm.length}
                        className={submitting ? 'disabled' : ''}
                    >
                        {submitting ? 'Adding...' : 'Add Alarm'}
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}

function AlarmDisplay({ alarm, onAlarmRemoval }) {
    const { Container, Row, Col, Button } = ReactBootstrap;

    const removeAlarm = () => {
        fetch(`/alarms/${alarm.name}`, { method: 'DELETE' }).then(() =>
            onAlarmRemoval(alarm),
        );
    };

    return (
        <Container fluname className={`alarm`}>
            <Row>
                <Col xs={10} className="name">
                    {alarm.name}
                </Col>
                <Col xs={1} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeAlarm}
                        aria-label="Remove Alarm"
                    >
                        <i className="fa fa-trash text-danger" />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
