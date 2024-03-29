import { useState } from "react";
import Logo from "./Logo";
import Alert from "./Alert";
import Loading from "./Loading";
import { useContext } from "react";
import { SessionContext } from "../providers/SessionProvider";
import { apiCall } from "../utils";
import {
  EventSourceContext,
  subscribeForServerSentEvent,
} from "../providers/EventSourceProvider";
import {
  WebsocketContext,
  subscribeForWebsocket,
} from "../providers/WebsocketProvider";

const SignUp = () => {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [birth, setBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertData, setAlertData] = useState({ enable: false });
  const [loading, setLoading] = useState();
  const { setLoggedInUser } = useContext(SessionContext);
  const { setEventSource } = useContext(EventSourceContext);
  const { setSocket } = useContext(WebsocketContext);

  const signUp = async (event) => {
    event.preventDefault();
    setAlertData({ enable: false });

    setLoading(true);
    const response = await apiCall({
      url: `${process.env.REACT_APP_SERVER_END_PONT}/sign_up`,
      method: "POST",
      body: {
        name: name,
        mobileNumber: Number(mobileNumber),
        birth: birth,
        email: email,
        password: password,
      },
    });
    if (response) {
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        setLoggedInUser(response.user);
        setEventSource(subscribeForServerSentEvent());
        setSocket(subscribeForWebsocket());
        document.getElementById("modalCloseSignupButton").click();
      } else {
        setAlertData({ ...response, enable: true });
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="modal fade"
      id="signupModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title w-100 text-center">
              <Logo />
            </div>
            <button
              type="button"
              id="modalCloseSignupButton"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <form
              className="form"
              onSubmit={(event) => {
                signUp(event);
              }}
            >
              <div className="text-box">
                <input
                  className="text-box"
                  type="text"
                  placeholder="Enter your Name"
                  required
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </div>
              <div className=" text-box">
                <input
                  className="text-box"
                  type="number"
                  placeholder="Enter your Mobile Number"
                  required
                  value={mobileNumber}
                  onChange={(event) => {
                    setMobileNumber(event.target.value);
                  }}
                />
              </div>
              <div className=" text-box">
                <input
                  className="text-box"
                  type="date"
                  placeholder="Enter your date of birth"
                  required
                  max={new Date().toISOString().substring(0, 10)}
                  value={birth}
                  onChange={(event) => {
                    setBirth(event.target.value);
                  }}
                />
              </div>
              <div className="text-box">
                <input
                  className="text-box"
                  type="email"
                  placeholder="Enter your Email-ID"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </div>

              <div className="text-box">
                <input
                  className="text-box"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </div>
              {alertData.enable && (
                <div className="text-box">
                  <Alert alertData={alertData} setAlertData={setAlertData} />
                </div>
              )}
              <div className="text-box">
                <button
                  disabled={loading}
                  className="button btn btn-primary"
                  style={{ width: "100%" }}
                >
                  {loading ? <Loading /> : <span>Create Your Account</span>}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            Do you have already account created ?
            <button
              type="button"
              className="btn btn-link"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              <div>
                <span>Login</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
