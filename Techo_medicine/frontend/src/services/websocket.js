const socket = new WebSocket("ws://localhost:7000"); //  Ensure correct backend port

socket.onopen = () => console.log(" WebSocket connected");
socket.onmessage = (event) => console.log(" Message received:", event.data);
socket.onerror = (error) => console.error(" WebSocket error:", error);
socket.onclose = () => console.log(" WebSocket disconnected");

export default socket; 
