import { axiosInstance } from "./axios";

export const signup = async (formData) => {
  const res = await axiosInstance.post("/auth/signup", formData);
  console.log("signup data",res.data);
  return res.data;
};

export const login = async (formData) => {
  const res = await axiosInstance.post("/auth/login", formData);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (err) {
    console.log("error in getAuthUser ", err);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const res = await axiosInstance.post("/auth/onboarding", userData);
  return res.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}



export async function sendFriendRequest(userId) {
  if (!userId) throw new Error("User ID is required");

  try {
    const response = await axiosInstance.post(
      `/users/friend-request/${userId}`,
    );
    return response.data;
  } catch (err) {
    console.error("Friend request error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`,
  );
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

// lib/api.js
export async function getStreamVideoToken() {
  const response = await axiosInstance.get("/video/token");
  return response.data;
}
