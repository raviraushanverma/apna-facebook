import UserAvatar from "./UserAvatar";
import { getLoggedInUser } from "../utility";
import { useState } from "react";

const Comment = (props) => {
  const [loading, setLoading] = useState();
  const user = getLoggedInUser();
  const commentDeleteData = async () => {
    setLoading(true);

    const deleteData = await fetch(
      `${process.env.REACT_APP_SERVER_END_PONT}/comment_delete/${props.postId}/${props.comment._id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }
    );
    const response = await deleteData.json();
    setLoading(false);
    props.commentUpdate(response.post);
  };
  return (
    <>
      <div style={{ padding: "10px" }}>
        <div className="d-flex justify-content-between">
          <UserAvatar
            userName={props.comment.owner.userName}
            time={props.comment.created}
          />
          {user._id === props.comment.owner.userId && (
            <div>
              <button type="button" className="btn btn-light">
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
                <i
                  style={{ cursor: "pointer" }}
                  className="fa-solid fa-trash-can"
                ></i>
              </button>
            </div>
          )}
        </div>
        {loading ? (
          <center>
            <div className="loader"></div>
          </center>
        ) : (
          <div className="comment-list">
            <h6
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                textAlign: "justify",
              }}
            >
              {props.comment.content}
            </h6>
          </div>
        )}
        <hr style={{ margin: "0px" }}></hr>
      </div>
    </>
  );
};

export default Comment;
