import { io } from "socket.io-client";

const socket = io("https://arrivechat.waysdatalabs.com", {
    autoConnect: false
});

export default socket;