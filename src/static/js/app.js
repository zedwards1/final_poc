function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <DateTime></DateTime>
                    <AlarmsCard />
                </Col>
            </Row>
        </Container>
    );
}

function DateTime() {
    const { Row, Button, Col } = ReactBootstrap;
    const [date, setDate] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000)

        return function cleanup(){
            clearInterval(timer)
        }
    })

    return(
        <div>
            <Row gutter={1}>
                <Col>
                    <p> Time : {date.toLocaleTimeString()}</p>
                </Col>
            </Row>
            <p> Date : {date.toLocaleDateString()}</p>

        </div>
    )
}

function AlarmsCard() {
    const [alarms, setAlarms] = React.useState(null);

    React.useEffect(() => {
        fetch('/alarms')
            .then((r) => r.json())
            .then(setAlarms);
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
                onAlarmAdd(alarm);
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
