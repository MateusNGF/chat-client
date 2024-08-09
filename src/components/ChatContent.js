import { Button, Container } from "react-bootstrap";
import { formartDate } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";




export function ChatContentComponent({messages, onSendMessage, profile}) {


    const inputText = useRef(null);

    function onSubmit(e){
        e.preventDefault();

        const text = inputText.current.value;

        onSendMessage({text});

        inputText.current.value = null;
    }


    return (
        <Container>
            <div className="card-body" data-mdb-perfect-scrollbar-init style={{ height: '400px', overflowY: 'scroll', overflowAnchor: 'revert', wordBreak: 'break-word' }}>
                <div className="divider d-flex align-items-center justify-content-center mb-4">
                    <p hidden={!!messages.length} className="text-center mx-3 mb-0 small text-muted">
                        Nenhuma mensagem
                    </p>
                </div>
                <div hidden={!messages.length}>
                    {
                        messages.map((content, index) => {
                            if (content.echo) {
                                return (
                                    <div className="d-flex flex-row justify-content-start mb-4" key={index}>
                                        <img src={content.picture} alt={content.username} style={{ width: '45px', height: '45px' }} />
                                        <div>
                                            {content?.messages.map(message =>
                                                <p className="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">{message.text}</p>
                                            )}
                                            <p className="small ms-3 mb-3 rounded-3 text-muted">
                                                {formartDate(content.timestamp) + ' | ' + content.username}
                                            </p>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="d-flex flex-row justify-content-end mb-4 pt-1" key={index}>
                                        <div>
                                            {content?.messages.map(message =>
                                                <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">{message.text}</p>
                                            )}
                                            <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
                                                {formartDate(content.timestamp) + ' | ' + content.username}
                                            </p>
                                        </div>
                                        <img src={content.picture} alt={content.username} style={{ width: '45px', height: '45px' }} />
                                    </div>
                                );
                            }
                        })
                    }
                </div>
            </div>
            <form onSubmit={onSubmit} className="card-footer text-muted d-flex justify-content-center align-items-center">
                <img src={profile?.picture} alt={profile?.username} className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                <input type="text" ref={inputText} className="form-control form-control-lg mx-2" placeholder="Escreva a mensagem" style={{ flex: 1 }} />
                <Button type="submit" className="btn btn-primary ms-2">
                    <FontAwesomeIcon size="lg" icon="paper-plane" />
                </Button>
            </form>
        </Container>
    )
}