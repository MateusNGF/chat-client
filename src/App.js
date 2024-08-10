import { useEffect, useRef, useState } from 'react';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { io } from 'socket.io-client';
import './App.css';
import { TabsGroupComponent } from './components/TabsGroup';
import { ChatContentComponent, ContainerNotificationToast, HeaderGroupChat, ProfileSettingModal } from './components/index.js';


function App() {

  const [ws, setWs] = useState(null);
  const [groups, changeGroup] = useState([]);
  const [currentChatGroup, setCurrentChatGroup] = useState(null);

  const [notifications, setNotifications] = useState([])

  const [cookies, setCookie] = useCookies(['profile']);

  const [ profile, setProfile ] = useState(null);

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

    socket.on('updateUsersOnline', (payload) => {
      console.log({updateUsersOnline: payload})
      const { groupId, quantity } = payload
      changeGroup( (_groups) => {
        return _groups.map( (group) => {
          if (group.id != groupId) return group;
          group.onlines = quantity;
          return group
        })
      })
    });

    socket.on('message', async (content) => {
      const incomingMSG = JSON.parse(content);

      if (incomingMSG.groupId != currentChatGroup) {
        addNotification(incomingMSG);
      };

      sendMessageToStack(incomingMSG)
    });

    setWs(socket);
    return () => {
      socket.disconnect();
    };
  }

  function sendMessageToStack(incomingMSG) {
    const { message, groupId } = incomingMSG

    changeGroup( (_groups) => {
        return _groups.map( (group) => {
          if (group.id != groupId) return group;

          group.messages = handlerMessages(group.messages, message);

          return group
        })
    })

    function handlerMessages(stackMSG, incomingMSG){
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
    };
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
    };

    const payload = {
      groupId: currentChatGroup,
      message
    }

    sendMessageToStack({
      ...payload,
      message: {
        ...message,
        echo: true
      }
    })

    ws.send(JSON.stringify(payload));
  };

  function processSignInGroup(content){
    const { groupId } = content
    ws.emit('joinGroup', { groupId }, (groupContent) => {
      console.log({
        joinGroup: groupContent,
      })
      if (groupContent.error) return alert(groupContent.error);
      changeGroup((acc) => acc.concat(groupContent));
      setCurrentChatGroup(groupContent.id);
    })
  }

  function processCreateGroup(){
     ws.emit('createGroup', cookies.profile, (groupContent) => {
      if (groupContent.error) return alert(groupContent.error);

      changeGroup((acc) => acc.concat(groupContent));
      setCurrentChatGroup(groupContent.id);
     });
  }

  
  function addNotification(message) {
    setNotifications((stack) => stack.concat({
      ...message,
      onClose: () => setNotifications((currentStack) =>
        currentStack.filter((_, i) => i !== stack.length)
      )
    }))
  }

  useEffect(() => {
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

        <ContainerNotificationToast
          notifications={notifications}
        />

        <Container className='py-5 '>

          <Row>
            <Col>
                <TabsGroupComponent 
                  groups={groups}
                  selectedTab={currentChatGroup}
                  onCreateGroup={processCreateGroup}
                  onSignInGroup={processSignInGroup}
                  onSelectGroup={setCurrentChatGroup}
                />
            </Col>
          </Row>
          <Row>

            <Container hidden={!!groups.length} >
              <Alert variant='warning' className='my-5 d-flex justify-content-center align-items-center'>
                <h5>Nenhum grupo conectado ou criado.</h5>
              </Alert>
            </Container>

            <Container hidden={!groups.length} className='card'>
              <HeaderGroupChat chatGroup={groups.find((group) => group.id === currentChatGroup)}/>
                <ChatContentComponent
                  profile={profile}
                  group={groups.find((group) => group.id === currentChatGroup)}
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
