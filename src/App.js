import './App.css';
import { useState, useEffect, useRef } from 'react';
import  {ChatContentComponent, HeaderGroupChat, ProfileSettingModal }  from './components/index.js';
import { io } from 'socket.io-client';
import { useCookies } from 'react-cookie';
import { Button, Row,Container, Col } from 'react-bootstrap';
import { TabsGroupComponent } from './components/TabsGroup';


function App() {

  const textInput = useRef(null);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);

  const [cookies, setCookie] = useCookies(['profile']);

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
  

  const sendMessage = ({ text }) => {
    if (!ws) return;

    const message = {
      username: profile.username,
      picture: profile.picture,
      message: {
        text: text
      },
      timestamp: new Date().toISOString()
    }

    sendMessageToStack({
      ...message,
      echo: true
    })

    ws.send(JSON.stringify(message));
  };

  useEffect(() => {
    console.log(cookies.profile)
    if (!profile && cookies.profile) {
      setProfile(cookies.profile);
    }
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
            const profile = {
              username: e.username,
              picture: e.picture
            }
            setProfile(profile);
            setCookie('profile', profile, { 
                path: '/',
                expires: new Date(Date.now() + 1000 * 60 * 60 * 5) 
            })
          }}
        />
      </section>
      <section hidden={!profile}	>


        <Container className='py-5 '>
          <Row>
            <Col>
                <TabsGroupComponent />
            </Col>
          </Row>
          <Row>
            <Container className='card'>
              <HeaderGroupChat onlines={usersOnline} />
              <ChatContentComponent
                profile={profile}
                messages={messages}
                onSendMessage={sendMessage}
              />
            </Container>

          </Row>
        </Container>


      </section>
    </div>
  );
}

export default App;
