import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

// export async function getRecommendedUsers(req, res) {
//   try {
//     const currentUserId = req.user.id;
//     const currentUser = req.user;

//     const recommandedUser = await User.find({
//       $and: [
//         { _id: { $ne: currentUserId } },
//         { _id: { $nin: currentUser.friends } },
//         { isOnboarded: true },
//       ],
//     });
//     res.status(200).json(recommandedUser);
//   } catch (err) {
//     console.error("Error in getRecommandedUsers controller", err.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

export async function getRecommendedUsers(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(req.user);
    const currentUserId = req.user._id;

    const recommendedUsers = await User.find({
      _id: {
        $ne: currentUserId,
        $nin: req.user.friends,
      },
      isOnboarded: true,
    }).select("-password");

    res.status(200).json(recommendedUsers);
  } catch (err) {
    console.error("Error in getRecommendedUsers controller", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "name profile nativeLanguage learningLanguage");

    res.status(200).json(user.friends);
  } catch (err) {
    console.log("error in getMyFriends controller", err.message);
    res.status(500).json({ message: "internal Server error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user._id;
    console.log("req.user:", req.user);

    const { id: recipientId } = req.params;

    //prevent self requesting
    if (myId.toString() === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send request to yourself" });
    }

    //check's if user exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(400).json({ message: "Recipient not found" });
    }

    //checks if user is friend or not
    if (
      recipient.friends.some(
        (friendId) => friendId.toString() === myId.toString(),
      )
    ) {
      return res
        .status(400)
        .json({ message: "you are already friends with this user" });
    }

    //checks if req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "request already exist blw you and this user" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (err) {
    console.log("error in sendFriendRequest", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "friend request not found" });
    }

    //verfy the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "you are not authorized to accept this request" });
    }

    //add each user to their friends array
    // Add sender to recipient's friends list
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    // Add recipient to sender's friends list
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    // changing  pending to accept status
    friendRequest.status = "accepted";
    await friendRequest.save();
    // //delete repend friend request
    // await FriendRequest.findByIdAndDelete(requestId);

    console.log("friend request is accepted");
    res.status(200).json({ message: "friend request accepted" });
  } catch (err) {
    console.log("error in accept friend request");
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "name profile nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "name profile");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (err) {
    console.log("error in get friend request ", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// export async function getFriendRequests(req, res) {
//   try {
//     const incomingReqs = await FriendRequest.find({
//       recipient: req.user.id,
//       status: "pending",
//     }).populate("sender", "name profile nativeLanguage learningLanguage");

//     const acceptedReqs = await FriendRequest.find({
//       recipient: req.user.id,
//       status: "accepted",
//     }).populate("recipient", "name profile");

//     res.status(200).json({ incomingReqs, acceptedReqs });
//   } catch (err) {
//     console.log("error in get friend request ", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// export async function getOutgoingFriendReqs(req, res) {
//   try {
//     const outgoingRequests = await FriendRequest.find({
//       sender: req.user.id,
//       status: "pending",
//     }).populate("recipition", "name profile nativeLanguage learningLanguage");

//     res.status(200).json(outgoingRequests);
//   } catch (err) {
//     console.log("error in get outgoing friend request", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id, // use _id
      status: "pending",
    }).populate(
      "recipient", // fixed typo
      "name profile nativeLanguage learningLanguage",
    );

    res.status(200).json(outgoingRequests);
  } catch (err) {
    console.log("error in get outgoing friend request", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
