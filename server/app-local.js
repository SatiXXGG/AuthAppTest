import createApp from './createApp.js';
import User from './controllers/local/User.js';
createApp({UserController: User, AppOrigin: "http://localhost:5173"})