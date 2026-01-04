import { io } from "../server.js";

export const onHangup = (data) => {
  let socketIdToEmitTo;

  if (data.ongoingCall.participants.caller.userId === data.userHangingupId) {
    socketIdToEmitTo = data.ongoingCall.participants.receiver.socketId;
  } else {
    socketIdToEmitTo = data.ongoingCall.participants.caller.socketId;
  }

  if (socketIdToEmitTo) {
    io.to(socketIdToEmitTo).emit("hangup");
  }
};
