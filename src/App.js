import { useEffect, useState } from 'react';
import {  Card, Col, Container, Row } from 'react-bootstrap';
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

  const [profile, setProfile] = useState(null);

  function initializeConnectionWithServer() {
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
      const { groupId, quantity } = payload
      changeGroup((_groups) => {
        return _groups.map((group) => {
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

    changeGroup((_groups) => {
      return _groups.map((group) => {
        if (group.id != groupId) return group;

        group.messages = handlerMessages(group.messages, message);

        return group
      })
    })

    function handlerMessages(stackMSG, incomingMSG) {
      const indexLastMSG = stackMSG.length - 1;
      const lastMessage = Object.assign({}, stackMSG[indexLastMSG]);

      const lastMSGIsSomeoneUser = lastMessage?.username === incomingMSG.username;
      if (lastMSGIsSomeoneUser) {
        return stackMSG.map((msg, index) => {
          if (index != indexLastMSG) return msg

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

  function processSignInGroup(content) {
    const { groupId } = content
    ws.emit('joinGroup', { groupId }, (groupContent) => {
      if (groupContent.error) return alert(groupContent.error);
      changeGroup((acc) => acc.concat(groupContent));
      setCurrentChatGroup(groupContent.id);
    })
  }

  function processCreateGroup() {
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
        currentStack.filter((_, i) => i != stack.length)
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

            <Container className='py-5'>
              <Row>
                <Col md={12}>
                  <Card style={{ borderRadius: '15px' }}>
                    <Card.Body>
                      <Row>
                        <Col md={6} lg={5} xl={4}  >
                            <TabsGroupComponent
                              groups={groups}
                              selectedTab={currentChatGroup}
                              onCreateGroup={processCreateGroup}
                              onSignInGroup={processSignInGroup}
                              onSelectGroup={setCurrentChatGroup}
                            />

                        </Col>
                        <Col md={6} lg={7} xl={8}>

                          <div hidden={!groups.length}>
                            <HeaderGroupChat chatGroup={groups.find((group) => group.id === currentChatGroup)} />
                            <ChatContentComponent
                              profile={profile}
                              group={groups.find((group) => group.id === currentChatGroup)}
                              onSendMessage={sendMessage}
                            />
                          </div>

                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>


            </Container>
            <Container>
              <Row lg={16} md={12} sm={12}>
                <Col lg={4} md={4} className='py-4 '>
                  <ins
                    class="adsbygoogle"
                    style={{ display: 'inline-block', backgroundColor: 'gray', width: '100%', height: '100%', border: '1px solid black'}}
                    data-ad-format="fluid"
                    data-ad-layout-key="-6t+ed+2i-1n-4w"
                    data-ad-client="ca-pub-6974751803479290"
                    data-ad-slot="7242885259"></ins>
                </Col>
                <Col lg={4} md={4} className='py-4'>
                  <ins
                    class="adsbygoogle"
                    style={{ display: 'inline-block', backgroundColor: 'gray', width: '100%', height: '100%', border: '1px solid black'}}
                    data-ad-format="fluid"
                    data-ad-layout-key="-6t+ed+2i-1n-4w"
                    data-ad-client="ca-pub-6974751803479290"
                    data-ad-slot="7242885259"></ins>
                </Col>
                <Col lg={4} md={4} className='py-4'>
                  <ins
                    class="adsbygoogle"
                    style={{ display: 'inline-block', backgroundColor: 'gray', width: '100%', height: '100%', border: '1px solid black'}}
                    data-ad-format="fluid"
                    data-ad-layout-key="-6t+ed+2i-1n-4w"
                    data-ad-client="ca-pub-6974751803479290"
                    data-ad-slot="7242885259"></ins>
                </Col>
              </Row>
            </Container>
          </Row>
        </Container>

      </section>
    </div>
  );
}

export default App;
