import UserAvatar from "./UserAvatar";
import { SessionContext } from "../providers/SessionProvider";
import { useContext, useEffect, useState } from "react";
import Loading from "./Loading";
import TimeAgo from "javascript-time-ago";
import { Link } from "react-router-dom";
import { apiCall } from "../utils";

const Comment = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setAditContent] = useState();
  const timeAgo = new TimeAgo("en-US");
  const [commentDeleteLoading, setCommentDeleteLoading] = useState();
  const { loggedInUser } = useContext(SessionContext);

  useEffect(() => {
    if (isEditing === true) {
      setAditContent(props.comment.content);
    }
  }, [isEditing, props.comment]);

  const commentDeleteData = async () => {
    setCommentDeleteLoading(true);
    const response = await apiCall({
      url: `${process.env.REACT_APP_SERVER_END_PONT}/comment_delete/${props.postId}/${props.comment._id}`,
      method: "DELETE",
    });
    setCommentDeleteLoading(false);
    if (response) {
      props.commentUpdate(response.post);
    }
  };

  const editCommentData = async (event) => {
    event.preventDefault();
    const response = await apiCall({
      url: `${process.env.REACT_APP_SERVER_END_PONT}/comment_edit/${props.postId}/${props.comment._id}`,
      method: "post",
      body: {
        content: editContent,
      },
    });
    if (response) {
      props.editComment(props.postId, props.comment._id, editContent);
    }
  };

  return (
    <div
      style={{ padding: "10px" }}
      id={props.comment._id}
      className={`${
        props.commentHash === props.comment._id ? "comment-highlight" : ""
      }`}
    >
      <div className="d-flex">
        <Link to={`/profile/${props.comment.owner._id}`}>
          <UserAvatar
            profilePicURL={
              loggedInUser?._id === props.comment.owner._id
                ? loggedInUser?.profilePicURL
                : props.comment.owner.profilePicURL
            }
          />
        </Link>
        <div
          style={{
            background: "#F0F2F5",
            padding: "10px",
            borderRadius: "10px",
            marginLeft: "10px",
          }}
        >
          <div className="d-flex">
            <h6>{props.comment.owner.name}</h6>
            <span
              style={{
                color: "gray",
                marginLeft: "10px",
                marginTop: "-2px",
              }}
            >
              {timeAgo.format(new Date(props.comment.created))}
            </span>
          </div>
          {isEditing ? (
            <form
              onSubmit={(event) => {
                editCommentData(event);
                setIsEditing(false);
              }}
            >
              <input
                className="form-control no-border"
                type="text"
                value={editContent}
                onChange={(event) => {
                  setAditContent(event.target.value);
                }}
              />
            </form>
          ) : (
            <div>
              <span>{props.comment.content}</span>
            </div>
          )}
          {loggedInUser?._id === props.comment.owner._id && (
            <div style={{ float: "right" }}>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  if (isEditing === false) {
                    setIsEditing(true);
                  } else {
                    setIsEditing(false);
                  }
                }}
              >
                <i
                  style={{ cursor: "pointer" }}
                  className="fa-regular fa-pen-to-square"
                ></i>
              </button>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  commentDeleteData();
                }}
              >
                {commentDeleteLoading ? (
                  <Loading />
                ) : (
                  <i
                    style={{ cursor: "pointer" }}
                    className="fa-solid fa-trash-can"
                  ></i>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
