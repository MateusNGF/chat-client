import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";





export function AlertComponent({ 
    type = 'success' | 'danger' | 'warning', 
    title = 'Alerta',
    children,
}) {

    const [ headerComponent, setHeaderComponent ] = useState(null)

    useEffect(() => {
        let icon = null

        switch (type) {
            case 'danger':
                icon = 'bug';
                break;
            case 'warning':
                icon = 'warning';
                break;
            default:
                icon = 'check-circle';
                break;
        }

        setHeaderComponent(
            <Card.Title className="d-flex align-items-center text-center py-3">
                <FontAwesomeIcon icon={icon} size="xl" className="px-4" />
                {title}
            </Card.Title>
        )
       }, [type])


    return (
        <Card bg={type} className="mb-2">
            <Card.Header>
                {headerComponent}
            </Card.Header>
            <Card.Body>
                <Card.Title>{children}</Card.Title>
            </Card.Body>

        </Card>
    )
}