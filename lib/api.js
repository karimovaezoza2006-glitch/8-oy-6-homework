import axios from "axios";

export const apiRequest = async ({
  url,
  method = "GET",
  body = null,
  token = null,
}) => {
  try {
    const authToken = token || localStorage.getItem("token");

    const res = await axios({
      url,
      method,
      data: body,
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : undefined,
      },
    });

    return res.data;
  } catch (err) {
    return { error: err.response ? err.response.data : err.message };
  }
};
