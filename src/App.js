import './App.css';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  {ProfileSettingModal }  from './components/index.js';
import { formartDate } from './utils';


function App() {

  const textInput = useRef(null);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);

  const [ profile, setProfile ] = useState(null);

  function initializeConnectionWithServer(){
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log("Connectado");
    };

    socket.onerror = (event) => {
       console.error("Error:" + event.data);
    }

    socket.onclose = () => {
      console.log("Desconectado");
    };

    socket.onmessage = async (event) => {
      const normalize = await event.data.text();
      const message = JSON.parse(normalize);

      setMessages((prev) => [...prev, message]);
    };

    setWs(socket);
    return () => {
      socket.close();
    };
  }


  const sendMessage = (e) => {
    e.preventDefault();
    if (!ws) return;

    const message = {
      username: profile.username,
      picture: profile.picture,
      message: textInput.current.value,
      timestamp: new Date().toISOString()
    }

    setMessages((prev) => [...prev, {
      ...message,
      echo: true
    }]);

    const { value } = textInput.current
    value && ws.send(JSON.stringify(message));
    textInput.current.value = null;
  };

  useEffect(() => {
    const closeConnectionCallback = initializeConnectionWithServer()

    return () => {
      closeConnectionCallback();
    }
  }, [profile])

  return (
    <div>
      <section>
        <ProfileSettingModal
          show={!profile}
          content={profile}
          onSubmit={(e) => {
            setProfile({
              username: e.username,
              picture: e.picture
            });
          }}
        />
      </section>
      <section hidden={!profile}	>
        <div className="container py-5">
          <div className="row d-flex justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-6">

              <div className="card" id="chat2">
                <div className="card-header d-flex justify-content-between align-items-center p-3">
                  <h5 className="mb-0">Chat</h5>
                  <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-sm" data-mdb-ripple-color="dark">Let's Chat
                    App</button>
                </div>
                <div className="card-body" data-mdb-perfect-scrollbar-init>
                  {
                    !messages.length ? (
                      <div className="divider d-flex align-items-center mb-4">
                        <p className="text-center mx-3 mb-0" style={{ color: '#a2aab7' }}>Nenhuma mensagem</p>
                      </div>
                    ) : (
                      messages.map((content, index) => (
                        content.echo ? (
                          <div className="d-flex flex-row justify-content-start mb-4" key={index}>
                            <img src={content.picture} alt="avatar 1" style={{ width: '45px', height: '100%' }} />
                            <div>
                              <p className="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">{content.message}</p>
                              <p className="small ms-3 mb-3 rounded-3 text-muted">{formartDate(content.timestamp)} | {content.username}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex flex-row justify-content-end mb-4 pt-1" key={index}>
                            <div>
                              <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">{content.message}</p>
                              <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
                                {formartDate(content.timestamp)} | {content.username}
                              </p>
                            </div>
                            <img src={content.picture} alt="avatar 1" style={{ width: '45px', height: '100%' }} />
                          </div>
                        )
                      ))
                    )
                  }


                </div>
                <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                  <img src={profile?.picture} alt={profile?.username} style={{width: '40px',height: '100%'}} />
                  <input type="text" ref={textInput} className="form-control form-control-lg" id="exampleFormControlInput1" onSubmit={sendMessage} placeholder="Type message" />
                  <a className="ms-1 text-muted" href="#!"><FontAwesomeIcon icon="paperclip"/></a>
                  <a className="ms-3 text-muted" href="#!"><FontAwesomeIcon icon="smile"/></a>
                  <a className="ms-3" href="#!" onClick={sendMessage}><FontAwesomeIcon icon="paper-plane"/></a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default App;
