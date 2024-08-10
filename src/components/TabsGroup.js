
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Button, Col, ButtonGroup, Modal, Form, Container, Alert } from 'react-bootstrap';
import { timeSince } from '../utils';

export function TabsGroupComponent({
    groups = [],
    selectedTab,
    onCreateGroup,
    onSignInGroup,
    onSelectGroup
}) {


    const [showModalSignIn, setShowModalSignIn] = useState(false);

    function processSelectGroup(groupID) {
        return onSelectGroup(groupID)
    }

    function processSignInGruoup(event) {
        event.preventDefault();

        const groupId = event.target[0].value
        setShowModalSignIn(false);
        return onSignInGroup({ groupId })
    }

    function processCreateGruoup() {
        return onCreateGroup()
    }

    useEffect(() => {
    }, [groups, selectedTab])

    return (
        <div>

            <div className="input-group rounded mb-3">
                <Col md={4} sm={2} className='d-flex justify-content-center align-items-center '>
                    <ButtonGroup>
                        <Button onClick={processCreateGruoup}><FontAwesomeIcon icon="plus" /></Button>
                        <Button onClick={() => setShowModalSignIn(true)}><FontAwesomeIcon icon="sign-in-alt" /></Button>
                    </ButtonGroup>
                </Col>
                <Col>
                    <input
                        type="search"
                        className="form-control rounded"
                        placeholder="Busque por codigo de grupo"
                        aria-label="Search"
                        aria-describedby="search-addon"
                    />
                </Col>
            </div>

            <div data-mdb-perfect-scrollbar-init style={{ position: "relative", height: "400px" }}>
                <ul className="list-unstyled mb-0">
                    <Container hidden={!!groups.length} >
                        <Alert variant='warning' className='my-5 d-flex justify-content-center align-items-center'>
                            <span>Nenhum grupo conectado ou criado.</span>
                        </Alert>
                    </Container>
                    {groups?.map((group, index) => (
                        <CardGroupComponent
                            key={index}
                            index={index}
                            group={group}
                            selectedTab={selectedTab}
                            processSelectGroup={processSelectGroup}
                        />
                    ))}
                </ul>
            </div>

            <Modal show={showModalSignIn} centered>
                <Modal.Header closeButton={() => setShowModalSignIn(false)}>
                    <Modal.Title>Insira o codigo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={processSignInGruoup}>
                        <Form.Group className="mb-3" controlId="groupId">
                            <Form.Label>Nome de usuário:</Form.Label>
                            <Form.Control
                                name="groupId"
                                minLength={5}
                                maxLength={10}
                                type="text"
                                autoFocus
                                required
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary">
                            Entrar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}



function CardGroupComponent({
    index,
    group,
    selectedTab,
    processSelectGroup
}) {

    function processLastMessageGroup(group) {
        if (!group?.messages?.length) return null;

        const lastUserMessages = group.messages.slice(-1)[0];
        
        if (lastUserMessages.echo) return preview;

        if (!lastUserMessages?.messages?.length) return null;

        const lastMessage = lastUserMessages.messages.slice(-1)[0];
        return {
            message: lastMessage.text,
            timeSince: timeSince(lastUserMessages.timestamp)
        };
    }

    const [preview, setPreview] = useState();

    useEffect(() => {
        setPreview(processLastMessageGroup(group))
    }, [group.messages])


    useEffect(() => {
        let timer = setInterval(() => {
            setPreview(processLastMessageGroup(group))
        }, 60000)

        return () => {
            clearInterval(timer)
        }
    })


    return (
        <li key={index} className="py-2">
            <div
                className="d-flex justify-content-between border-bottom p-2 rounded"
                style={{ cursor: 'pointer', backgroundColor: selectedTab === group.id ? '#e0e0e0' : 'white' }}
                onClick={() => processSelectGroup(group.id)}>

                <div className="d-flex">
                    <div>
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#333'
                            }}
                            className="d-flex align-self-center me-3"
                        >
                            {group.id.substring(0, 2)}
                        </div>
                        <span className="badge bg-warning badge-dot"></span>
                    </div>
                    <div className="pt-1">
                        <p className="fw-bold mb-0">{group.id}</p>
                        <p className="small text-muted">{preview?.message}</p>
                    </div>
                </div>
                <div className="pt-1">
                    <p className="small text-muted mb-1">{preview?.timeSince}</p>
                    <span className="badge bg-danger rounded-pill float-end">2</span>
                </div>
            </div>
        </li>
    )
}