import { useContext } from "react";
import { SessionContext } from "../providers/SessionProvider";
import UserAvatar from "./UserAvatar";
import { ActiveChatFriendContext } from "../providers/ActiveChatFriendProvider";
import { OnlineUserContext } from "../providers/OnlineUserProvider";

const FriendChatList = () => {
  const { setActiveChatFriend } = useContext(ActiveChatFriendContext);
  const { loggedInUser } = useContext(SessionContext);
  const { friends } = useContext(OnlineUserContext);

  if (!loggedInUser || !friends.length) {
    return null;
  }

  return (
    <div className="chat-card contacts_card">
      {friends.length > 7 && (
        <div className="chat-card-header">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search Friends..."
              name=""
              className="form-control search"
            />
            <div className="d-flex">
              <span className="input-group-text search_btn">
                <i className="fas fa-search"></i>
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="card-body contacts_body">
        <ul className="contacts">
          {friends.map((friend) => {
            return (
              <li
                key={friend._id}
                className="friend-list-item"
                onClick={() => {
                  setActiveChatFriend(friend);
                }}
              >
                <div className="d-flex" style={{ marginTop: "7px" }}>
                  <div className="img_cont">
                    <UserAvatar profilePicURL={friend.profilePicURL} />
                    <span
                      className={`status_icon ${
                        friend.isOnline ? "online" : ""
                      }`}
                    ></span>
                  </div>
                  <div className="user_info">
                    <div>
                      <span>
                        <h6>{friend.name}</h6>
                      </span>
                      <p>
                        {friend.name} is
                        {friend.isOnline ? " Online" : " Offline"}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="card-footer"></div>
    </div>
  );
};

export default FriendChatList;
