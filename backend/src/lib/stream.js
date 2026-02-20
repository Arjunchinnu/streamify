import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream Api key or serect is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret, {
  timeout: 15000, // ✅ 15 seconds
});

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (err) {
    console.error("erroe upserting stream user ", err);
    throw err;
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (err) {
    console.log("Error in generating stream token", err);
  }
};
