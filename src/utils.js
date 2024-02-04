export const apiCall = async ({ url, method = "GET", body }) => {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const jsonRes = await fetch(url, options);
    const response = await jsonRes.json();
    if (!response.isSuccess) {
      return false;
    } else {
      return response;
    }
  } catch (error) {
    console.log("Error while calling API =>", error);
  }
};

export const acceptFriendRequest = async (loggedInUserId, userId) => {
  return await apiCall({
    url: `${process.env.REACT_APP_SERVER_END_PONT}/friend_request_accept/${userId}`,
    method: "POST",
    body: { loggedInUserId },
  });
};

export const getNotifications = async (loggedInUserId, limit) => {
  return await apiCall({
    url: `${
      process.env.REACT_APP_SERVER_END_PONT
    }/get_notifications/${loggedInUserId}/${limit ? limit : ""}`,
  });
};
