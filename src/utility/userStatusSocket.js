import io from "socket.io-client";

class WSService {
  initializeSocket = async (userID) => {
    try {
      this.socket = io("http://3.91.192.145:3001/user-status", {
        transports: ["websocket"],
        auth: {
          token: userID,
        },
      });
    } catch (error) {
      console.log("socket is not inialized", error);
    }
  };

  emit(event, data = {}) {
    this.socket.emit(event, data);
    console.log(data);
  }

  on(event, cb) {
    this.socket.on(event, cb);
  }

  disconnect() {
    this.socket.disconnect();
  }

  removeListener(listenerName) {
    this.socket.removeListener(listenerName);
  }
}

const UserStatus = new WSService();

export default UserStatus;
