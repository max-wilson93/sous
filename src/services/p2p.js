import Gun from 'gun';

// Initialize GunDB
const gun = Gun({
  peers: ['http://your-gundb-server.com/gun'], // Replace with your GunDB server URL
});

// Export GunDB instance
export default gun;
