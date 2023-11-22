import { io } from "socket.io-client";

const socket = io("https://ae.arrive.waysdatalabs.com", {
    autoConnect: false
});

export default socket;

// https://ae.arrive.waysdatalabs.com

// https://ae.arrive.waysdatalabs.com