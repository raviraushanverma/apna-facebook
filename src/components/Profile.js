import PostList from "./PostList";
import ProfileUserAvatar from "./ProfileUserAvatar";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../providers/SessionProvider";
import MediaUpload from "./MediaUpload";
import CenterPageLoader from "./CenterPageLoader";
import Loading from "./Loading";
import { apiCall } from "../utils";

const Profile = () => {
  let { user_id } = useParams();
  const [user, setUser] = useState({});
  const { loggedInUser, setLoggedInUser } = useContext(SessionContext);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [isUpdatingFriendRequest, setIsUpdatingFriendRequest] = useState(false);

  const getProfilePic = () => {
    return loggedInUser && loggedInUser._id === user_id
      ? loggedInUser.profilePicURL
      : user.profilePicURL;
  };

  useEffect(() => {
    setIsFetchingUser(true);
    async function fetchData() {
      const response = await apiCall({
        url: `${process.env.REACT_APP_SERVER_END_PONT}/get_user/${user_id}`,
      });
      if (response) {
        setUser(response.user);
      }

      setIsFetchingUser(false);
    }
    fetchData();
  }, [user_id]);

  const onProfileUploadHandler = async (media, fieldName) => {
    const response = await apiCall({
      url: `${process.env.REACT_APP_SERVER_END_PONT}/profile_update/${loggedInUser._id}`,
      method: "POST",
      body: {
        [fieldName]: media[0],
      },
    });

    if (response) {
      setLoggedInUser({ ...loggedInUser, [fieldName]: media[0] });
    }
  };

  const updateFriendRequest = async (uri) => {
    const response = await apiCall({
      url: `${process.env.REACT_APP_SERVER_END_PONT}/${uri}/${user_id}`,
      method: "POST",
      body: {
        loggedInUserId: loggedInUser._id,
      },
    });
    if (response) {
      setUser(response.user);
      setIsUpdatingFriendRequest(false);
    }
    setIsUpdatingFriendRequest(true);
  };

  const mainUser =
    loggedInUser && loggedInUser._id === user_id ? loggedInUser : user;
  const isDev = process.env.NODE_ENV === "development";

  if (isFetchingUser) {
    return <CenterPageLoader />;
  }

  if (!loggedInUser) {
    return null;
  }

  return (
    <div className="container">
      <div className="profile-banner">
        {mainUser.banner && (
          <img
            src={isDev ? mainUser.banner.url : mainUser.banner.secure_url}
            alt="banner"
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          />
        )}
        <div className="profile-user-avatar">
          <ProfileUserAvatar profilePicURL={getProfilePic()} />
          <h3 className="profile-user-avatar-user-name">{user.name}</h3>
        </div>
        {loggedInUser && loggedInUser._id === user_id ? (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              color: "white",
              background: "black",
              padding: "10px",
            }}
          >
            <MediaUpload
              onSuccessUpload={(media) => {
                onProfileUploadHandler(media, "banner");
              }}
              isMultiple={false}
            >
              <i
                className="fa-solid fa-camera"
                style={{
                  fontSize: "30px",
                  cursor: "pointer",
                }}
              ></i>
            </MediaUpload>
          </div>
        ) : (
          <button
            style={{ width: "150px" }}
            type="button"
            className="btn btn-primary add-friend"
            onClick={() => {
              updateFriendRequest(
                user.friendRequests[loggedInUser._id]
                  ? "friend_request_cancel"
                  : "friend_request_send"
              );
            }}
            disabled={isUpdatingFriendRequest}
          >
            {isUpdatingFriendRequest ? (
              <Loading />
            ) : (
              <>
                {user.friendRequests[loggedInUser._id]
                  ? "Cancel Request"
                  : "Add Friend"}
              </>
            )}
          </button>
        )}
      </div>
      {loggedInUser && loggedInUser._id === user_id && (
        <MediaUpload
          onSuccessUpload={(media) => {
            onProfileUploadHandler(media, "profilePicURL");
          }}
          isMultiple={false}
        >
          <i
            className="fa-solid fa-camera"
            style={{
              fontSize: "30px",
              cursor: "pointer",
            }}
          ></i>
        </MediaUpload>
      )}
      <div className="row" style={{ marginTop: "96px" }}>
        <div className="col-md-3">
          <div
            style={{
              background: "white",
              marginBottom: "10px",
            }}
          >
            <div style={{ textTransform: "capitalize" }}>
              <i
                className="fa-solid fa-signature"
                style={{ padding: "20px" }}
              ></i>
              {user.name}
            </div>
            <div>
              <i className="fa-solid fa-mobile" style={{ padding: "20px" }}></i>
              {user.mobileNumber}
            </div>
            <div>
              <i
                className="fa-solid fa-calendar-days"
                style={{ padding: "20px" }}
              ></i>
              {new Date(user.birth).toDateString()}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <PostList
            isProfilePage={true}
            profilePicURL={getProfilePic()}
            userId={user_id}
          />
        </div>
      </div>
    </div>
  );
};
export default Profile;
