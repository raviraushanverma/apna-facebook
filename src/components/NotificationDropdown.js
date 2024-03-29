import { SessionContext } from "../providers/SessionProvider";
import { useCallback, useContext, useEffect } from "react";
import NotificationList from "./NotificationList";
import { Link } from "react-router-dom";
import { EventSourceContext } from "../providers/EventSourceProvider";
import { NotificationContext } from "../providers/NotificationProvider";
import { apiCall } from "../utils";
import { PostContext } from "../providers/PostProvider";

const NotificationDropdown = () => {
  const { loggedInUser, setLoggedInUser } = useContext(SessionContext);
  const { postList, setPostList } = useContext(PostContext);
  const { eventSource } = useContext(EventSourceContext);
  const { notifications, setNotifications, playNotificationSound } =
    useContext(NotificationContext);

  const onEventMessage = useCallback(
    (event) => {
      const eventStream = JSON.parse(event.data);
      if (eventStream && eventStream.notificationStream) {
        const { notificationStream } = eventStream;
        if (notificationStream.operationType === "insert") {
          console.log(
            "notificationStream.newNotification ",
            notificationStream.newNotification
          );
          playNotificationSound();
          const isThisNotificationAlreadyExist = notifications.find(
            (notification) =>
              notification._id === notificationStream.newNotification._id
          );
          if (!isThisNotificationAlreadyExist) {
            setLoggedInUser(notificationStream.newNotification.owner);
            setNotifications([
              notificationStream.newNotification,
              ...notifications,
            ]);
            if (notificationStream.newNotification.post) {
              const tempPost = postList.map((post) => {
                if (post._id === notificationStream.newNotification.post._id) {
                  return notificationStream.newNotification.post;
                } else {
                  return { ...post };
                }
              });
              setPostList(tempPost);
            }
          }
        } else if (notificationStream.operationType === "delete") {
          const tempNotifications = [...notifications];
          const notifyObjIndex = tempNotifications.findIndex((notify) => {
            return notify._id === notificationStream.deletedNotificationId;
          });
          if (notifyObjIndex !== -1) {
            tempNotifications.splice(notifyObjIndex, 1);
            setNotifications(tempNotifications);
            setLoggedInUser(notificationStream.owner);
          }
        }
      }
    },
    [
      notifications,
      playNotificationSound,
      postList,
      setLoggedInUser,
      setNotifications,
      setPostList,
    ]
  );

  useEffect(() => {
    if (eventSource) {
      eventSource.addEventListener("message", onEventMessage);
    }
    return () => {
      if (eventSource) {
        eventSource.removeEventListener("message", onEventMessage);
      }
    };
  }, [eventSource, notifications, postList, loggedInUser, onEventMessage]);

  if (!loggedInUser) {
    return null;
  }

  const unreadNotifications = notifications.filter(
    (notifyObj) => notifyObj.isRead === false
  );

  const onNotficationRead = async () => {
    if (unreadNotifications.length > 0) {
      // updating frontend first
      const tempNotifications = notifications.map((notify) => {
        return {
          ...notify,
          isRead: true,
        };
      });
      setNotifications(tempNotifications);

      // updating backend
      const unreadNotificationsIdArray = unreadNotifications.map(
        (notifyObj) => ({ _id: notifyObj._id })
      );
      await apiCall({
        url: `${process.env.REACT_APP_SERVER_END_PONT}/notfication_read/${loggedInUser._id}`,
        method: "POST",
        body: { unreadNotificationsIdArray },
      });
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-light position-relative"
        id="dropdownMenu2"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title="notification"
        onClick={() => {
          onNotficationRead();
        }}
      >
        <i className="fa-regular fa-bell" style={{ fontSize: "21px" }}></i>
        {unreadNotifications.length > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadNotifications.length}
          </span>
        )}
      </button>
      <ul
        className="dropdown-menu scrollable-menu dropdown-menu-end dropdown-menu-lg-end"
        aria-labelledby="dropdownMenu2"
        style={{
          width: "350px",
          overflowY: "auto",
          marginRight: "-77px",
          boxShadow:
            "0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ position: "relative" }}>
          <h4 style={{ textAlign: "center" }}>Notifications</h4>
          <small
            style={{
              position: "absolute",
              right: "7px",
              bottom: "3px",
            }}
          >
            <Link to={`/notifications`}>See All</Link>
          </small>
        </div>

        <hr className="dropdown-divider"></hr>
        {notifications.length === 0 && (
          <div
            className="complete-center"
            style={{ width: "100%", height: "100px" }}
          >
            You don't have any notifications!
          </div>
        )}
        <NotificationList
          notifications={notifications}
          loggedInUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
        />
      </ul>
    </div>
  );
};

export default NotificationDropdown;
