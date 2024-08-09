
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { Badge, Button, Nav, Row, Col, ButtonGroup } from 'react-bootstrap';

export function TabsGroupComponent({
    groups = [],
    selectedTab,
    onCreateGroup,
    onSignInGroup,
    onSelectGroup
}) {

    function processSelectGroup(groupID) {
        return onSelectGroup(groupID)
    }

    function processSignInGruoup() {
        return onSignInGroup()
    }

    function processCreateGruoup() {
        return onCreateGroup()
    }


    useEffect(() => {
    }, [ groups, selectedTab ])

    return (
        <Row cols={12}>
            <Col md={2} sm={3} className='d-flex justify-content-center align-items-center '>
                <ButtonGroup>
                    <Button onClick={processCreateGruoup}><FontAwesomeIcon icon="plus" /></Button>
                    <Button onClick={processSignInGruoup}><FontAwesomeIcon icon="sign-in-alt" /></Button>
                </ButtonGroup>
            </Col>
            <Col md={10} sm={8} className='d-flex justify-content-start align-items-bottom overflowX-scroll' style={{ overflowX: 'scroll'}}>
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
        </Row>

    );
}