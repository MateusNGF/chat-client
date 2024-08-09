
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Button, Nav, Row, Col, ButtonGroup } from 'react-bootstrap';

export function TabsGroupComponent() {

    function processSelectGroup(groupSelectedID) {
        console.log(groupSelectedID)
    }
    return (
        <Row cols={12}>
            <Col md={2} sm={3} className='d-flex justify-content-center align-items-center '>
                <ButtonGroup>
                    <Button><FontAwesomeIcon icon="plus" /></Button>
                    <Button><FontAwesomeIcon icon="sign-in-alt" /></Button>
                </ButtonGroup>
            </Col>
            <Col md={8} sm={8} className='d-flex justify-content-start align-items-bottom'>
                <Nav variant="tabs">
                    <Nav.Item>
                        <Nav.Link className='p-2' eventKey="teste1">
                            AR3-DFC <Badge bg="warning" text="dark">1</Badge>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className='p-2' eventKey="teste2" onClick={processSelectGroup}>
                            AR3-DFC <Badge bg="warning" text="dark">5</Badge>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className='p-2' eventKey="teste3">
                            AR3-DFC <Badge bg="warning" text="dark">4</Badge>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Col>
        </Row>

    );
}