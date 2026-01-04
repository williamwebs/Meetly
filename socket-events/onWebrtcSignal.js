import { io } from "../server.js";

export const onWebrtcSignal = async (data) => {
  if (data.isCaller) {
    // emit to receiver
    if (data.ongoingCall.participants.receiver.socketId) {
      io.to(data.ongoingCall.participants.receiver.socketId).emit(
        "webrtcSignal",
        data
      );
    }
  } else {
    if (data.ongoingCall.participants.caller.socketId) {
      io.to(data.ongoingCall.participants.caller.socketId).emit(
        "webrtcSignal",
        data
      );
    }
  }
};
