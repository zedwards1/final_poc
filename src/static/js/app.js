function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <AlarmsCard />
                </Col>
            </Row>
        </Container>
    );
}

function AlarmsCard() {
    const [alarms, setAlarms] = React.useState(null);

    React.useEffect(() => {
        fetch('/alarms')
            .then((r) => r.json())
            .then(setAlarms);
    }, []);

    const onNewAlarm = React.useCallback(
        (newAlarm) => {
            setAlarms([...alarms, newAlarm]);
        },
        [alarms],
    );

    const onAlarmUpdate = React.useCallback(
        (alarm) => {
            const index = alarms.findIndex((i) => i.id === alarm.id);
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
            const index = alarms.findIndex((i) => i.id === alarm.id);
            setAlarms([...alarms.slice(0, index), ...alarms.slice(index + 1)]);
        },
        [alarms],
    );

    if (alarms === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddAlarmForm onNewAlarm={onNewAlarm} />
            {alarms.length === 0 && (
                <p className="text-center">No alarms yet! Add one above!</p>
            )}
            {alarms.map((alarm) => (
                <AlarmDisplay
                    alarm={alarm}
                    key={alarm.id}
                    onAlarmUpdate={onAlarmUpdate}
                    onAlarmRemoval={onAlarmRemoval}
                />
            ))}
        </React.Fragment>
    );
}

function AddAlarmForm({ onNewAlarm }) {
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
                onNewAlarm(alarm);
                setSubmitting(false);
                setNewAlarm('');
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

function AlarmDisplay({ alarm, onAlarmUpdate, onAlarmRemoval }) {
    const { Container, Row, Col, Button } = ReactBootstrap;

    const toggleCompletion = () => {
        fetch(`/alarms/${alarm.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: alarm.name,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((r) => r.json())
            .then(onAlarmUpdate);
    };

    const removeAlarm = () => {
        fetch(`/alarms/${alarm.id}`, { method: 'DELETE' }).then(() =>
            onAlarmRemoval(alarm),
        );
    };

    return (
        <Container fluid className={`alarm`}>
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
