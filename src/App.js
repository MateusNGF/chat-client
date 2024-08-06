import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function App() {
  return (
    <div>
      <section>
        <div class="container py-5">
          <div class="row d-flex justify-content-center">
            <div class="col-md-10 col-lg-8 col-xl-6">

              <div class="card" id="chat2">
                <div class="card-header d-flex justify-content-between align-items-center p-3">
                  <h5 class="mb-0">Chat</h5>
                  <button type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-sm" data-mdb-ripple-color="dark">Let's Chat
                    App</button>
                </div>
                <div class="card-body" data-mdb-perfect-scrollbar-init>

                  <div class="d-flex flex-row justify-content-start">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                      alt="avatar 1" style={{width: '45px',height: '100%'}} />
                    <div>
                      <p class="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">Hi</p>
                      <p class="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">How are you ...???
                      </p>
                      <p class="small p-2 ms-3 mb-1 rounded-3 bg-body-tertiary">What are you doing
                        tomorrow? Can we come up a bar?</p>
                      <p class="small ms-3 mb-3 rounded-3 text-muted">23:58</p>
                    </div>
                  </div>

                  <div class="divider d-flex align-items-center mb-4">
                    <p class="text-center mx-3 mb-0" style={{color: '#a2aab7'}}>Today</p>
                  </div>

                  <div class="d-flex flex-row justify-content-end mb-4 pt-1">
                    <div>
                      <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">Hiii, I'm good.</p>
                      <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">How are you doing?</p>
                      <p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">Long time no see! Tomorrow
                        office. will
                        be free on sunday.</p>
                      <p class="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">00:06</p>
                    </div>
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                      alt="avatar 1" style={{width: '45px',height: '100%'}} />
                  </div>

                </div>
                <div class="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                  <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                    alt="avatar 3" style={{width: '40px',height: '100%'}} />
                  <input type="text" class="form-control form-control-lg" id="exampleFormControlInput1" placeholder="Type message" />
                  <a class="ms-1 text-muted" href="#!"><FontAwesomeIcon icon="paperclip"/></a>
                  <a class="ms-3 text-muted" href="#!"><FontAwesomeIcon icon="smile"/></a>
                  <a class="ms-3" href="#!"><FontAwesomeIcon icon="paper-plane"/></a>
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
