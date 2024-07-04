import createApp from './createApp.js';
import User from './controllers/production/User.js';
createApp({UserController: User, AppOrigin: "https://satixx-auth.vercel.app"})