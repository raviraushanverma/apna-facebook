import { SessionContext } from "../providers/SessionProvider";
import { useContext } from "react";
import NotificationList from "./NotificationList";
import { Link } from "react-router-dom";

const Notification = ({ notifications = [], setNotifications }) => {
  const { loggedInUser } = useContext(SessionContext);

  const unreadNotifications = notifications.filter(
    (notifyObj) => notifyObj.isRead === false
  );

  const notficationSeen = async () => {
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
      const serverData = await fetch(
        `${process.env.REACT_APP_SERVER_END_PONT}/notfication_seen/${loggedInUser._id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ unreadNotificationsIdArray }),
        }
      );
      await serverData.json();
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-light position-relative"
        id="dropdownMenu2"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={() => {
          notficationSeen();
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
          marginRight: "-87px",
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
            <Link to={`/notifications`}>See all</Link>
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
        <NotificationList notifications={notifications} />
      </ul>
    </div>
  );
};

export default Notification;
