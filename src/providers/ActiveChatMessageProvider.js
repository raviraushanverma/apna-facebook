import { createContext, useContext, useEffect, useState } from "react";
import { ActiveChatFriendContext } from "./ActiveChatFriendProvider";
import { apiCall } from "../utils";
import { SessionContext } from "./SessionProvider";

export const ActiveChatMessageContext = createContext();

const ActiveChatMessageProvider = (props) => {
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const { activeChatFriend } = useContext(ActiveChatFriendContext);
  const { loggedInUser } = useContext(SessionContext);

  useEffect(() => {
    (async () => {
      if (activeChatFriend) {
        setIsChatLoading(true);
        const response = await apiCall({
          url: `${process.env.REACT_APP_SERVER_END_PONT}/get-chat/${loggedInUser._id}/${activeChatFriend._id}`,
        });
        if (response) {
          setActiveChatMessages(response.chats || []);
        }
        setIsChatLoading(false);
      }
    })();
  }, [loggedInUser, activeChatFriend]);

  return (
    <ActiveChatMessageContext.Provider
      value={{ activeChatMessages, setActiveChatMessages, isChatLoading }}
    >
      {props.children}
    </ActiveChatMessageContext.Provider>
  );
};

export default ActiveChatMessageProvider;
