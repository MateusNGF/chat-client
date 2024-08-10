import { useEffect, useState } from 'react'
import { Container, Toast, ToastContainer } from 'react-bootstrap'

export function NotificationToast({
    content,
    onClose
}) {

    const [show, setShow] = useState(true)

    const [from, setFrom] = useState({
        username: content.message.username,
        picture: content.message.picture
    })
    const [message, setMessage] = useState({
        text: content.message.message.text,
        timestamp: content.message.timestamp
    })

    useEffect(() => {

        const timeout = setTimeout(() => {
            setShow(false)
            onClose()
        }, 90000)

        return () => {
            clearTimeout(timeout)
            setShow(false)
            onClose()
        }
    }, [])

    return (
        <Toast show={show} onClose={() => setShow(false) && onClose()} delay={3000}>
            <Toast.Header>
                <img src={from.picture} className="rounded me-2" alt={from.username} style={{ width: '32px', height: '32px' }} />
                <strong className="me-auto">{from.username}</strong>
                <small className="text-muted">{message.timestamp}</small>
            </Toast.Header>
            <Toast.Body>{message.text}</Toast.Body>
        </Toast>
    )
}

export function ContainerNotificationToast({
    notifications
}) {

    useEffect(() => {
        console.log(notifications)
    }, [notifications])

    return (
        <Container>
            <ToastContainer className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                {notifications.map((notification, index) => (
                    <NotificationToast
                        key={index}
                        content={notification}
                        onClose={() => notification?.onClose()}
                    />
                ))}
            </ToastContainer>
        </Container>
    )
}
