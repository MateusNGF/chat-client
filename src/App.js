import './App.css';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  {ProfileSettingModal }  from './components/index.js';
import { formartDate } from './utils';
import { io } from 'socket.io-client';


function App() {

  const textInput = useRef(null);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);

  const [ profile, setProfile ] = useState(null);
  const [ usersOnline, setusersOnline ] = useState(0);

  function initializeConnectionWithServer(){
    const socket = io('ws://localhost:8080');

    socket.on('connect', () => {
      console.log("Connectado");
    });

    socket.on('connect_error', (error) => {
      console.error("Erro: " + error.message);
    });

    socket.on('disconnect', () => {
      console.log("Desconectado");
    });

    socket.on('updateUsersOnline', ({ quantity }) => {
      setusersOnline(quantity); 
    });

    socket.on('message', async (content) => {
      const message = JSON.parse(content);

      sendMessageToStack(message)
    });

    setWs(socket);
    return () => {
      socket.disconnect();
    };
  }

  function sendMessageToStack(incomingMSG) {
    setMessages((stackMSG) => {
      const indexLastMSG = stackMSG.length - 1;
      const lastMessage = Object.assign({}, stackMSG[indexLastMSG]);

      const lastMSGIsSomeoneUser = lastMessage?.username === incomingMSG.username;
      if (lastMSGIsSomeoneUser) {
        return stackMSG.map((msg, index) => {
           if (index !== indexLastMSG) return msg

           return {
             ...msg,
             messages: [...msg.messages, incomingMSG.message],
             timestamp: incomingMSG.timestamp
           }
        })
      } else {
        return [
          ...stackMSG,
          {
            username: incomingMSG.username,
            picture: incomingMSG.picture,
            messages: [incomingMSG.message],
            timestamp: incomingMSG.timestamp,
            echo: !!incomingMSG.echo
          }
        ]
      }
    });
  }
  

  const sendMessage = (e) => {
    e.preventDefault();
    if (!ws) return;

    const message = {
      username: profile.username,
      picture: profile.picture,
      message: {
        text: textInput.current.value
      },
      timestamp: new Date().toISOString()
    }

    sendMessageToStack({
      ...message,
      echo: true
    })

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
                  <span id="online-users" class="badge bg-success me-2">{usersOnline} online</span>
                  {/* <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-sm" data-mdb-ripple-color="dark">Let's Chat
                    App</button> */}
                </div>
                <div className="card-body" data-mdb-perfect-scrollbar-init style={{ height: '400px', overflowY: 'scroll', overflowAnchor: 'revert', wordBreak: 'break-word' }}>
                      <div hidden={messages.length} className="divider d-flex align-items-center mb-4">
                        <p className="text-center mx-3 mb-0" style={{ color: '#a2aab7' }}>Nenhuma mensagem</p>
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
                <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                  <img src={profile?.picture} alt={profile?.username} style={{width: '40px',height: '100%'}} />
                  <input type="text" ref={textInput} className="form-control form-control-lg" id="exampleFormControlInput1" onSubmit={sendMessage} placeholder="Type message" />
                  {/* <a className="ms-1 text-muted" href="#!"><FontAwesomeIcon icon="paperclip"/></a> */}
                  {/* <a className="ms-3 text-muted" href="#!"><FontAwesomeIcon icon="smile"/></a> */}
                  <a className="ms-3" href="#!" onClick={sendMessage}><FontAwesomeIcon size='lg' icon="paper-plane"/></a>
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
