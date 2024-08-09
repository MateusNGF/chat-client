
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Badge, Button, Nav, Row, Col, ButtonGroup, Modal, Form } from 'react-bootstrap';

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
        return onSignInGroup({groupId})
    }

    function processCreateGruoup() {
        return onCreateGroup()
    }


    useEffect(() => {
    }, [groups, selectedTab])

    return (
        <Row cols={12}>
            <Col md={2} sm={3} className='d-flex justify-content-center align-items-center '>
                <ButtonGroup>
                    <Button onClick={processCreateGruoup}><FontAwesomeIcon icon="plus" /></Button>
                    <Button onClick={e => setShowModalSignIn(true)}><FontAwesomeIcon icon="sign-in-alt" /></Button>
                </ButtonGroup>
            </Col>
            <Col md={10} sm={8} className='d-flex justify-content-start align-items-bottom overflowX-scroll' >
                <Nav variant="tabs" activeKey={selectedTab}>
                    {groups?.map((group, index) => (
                        <Nav.Item key={index} onClick={() => processSelectGroup(group.id)} >
                            <Nav.Link className='p-2' eventKey={group.id}>
                                {group.id}
                                {/* <Badge bg="warning" text="dark">{group.messages.length}</Badge> */}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </Col>
            <Modal show={showModalSignIn} centered>
                <Modal.Header closeButton={ e => setShowModalSignIn(false)}>
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
        </Row>

    );
}