import { useEffect } from "react"
import { Card } from "react-bootstrap"

export function HeaderGroupChat({
    chatGroup,
}){

    useEffect(() => {}, [chatGroup,  chatGroup?.onlines])
    return (
        <Card.Header className=" d-flex justify-content-between align-items-center px-2">
            <h5 className="mb-0">Chat: {chatGroup?.id}</h5>
            <span id="online-users" className="badge bg-success me-2">{chatGroup?.onlines} online</span>
        </Card.Header>
    )
}