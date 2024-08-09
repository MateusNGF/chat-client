import { useEffect } from "react"

export function HeaderGroupChat({
    chatGroup,
}){

    useEffect(() => {}, [chatGroup,  chatGroup?.onlines])
    return (
        <div className="card-header d-flex justify-content-between align-items-center p-3">
            <h5 className="mb-0">Chat: {chatGroup?.id}</h5>
            <span id="online-users" className="badge bg-success me-2">{chatGroup?.onlines} online</span>
        </div>
    )
}