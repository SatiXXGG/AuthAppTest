// export const API_HOST = "https://authapptest.onrender.com";
// export const WEB_HOST = "https://satixx-auth.vercel.app";

export const API_HOST = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://authapptest.onrender.com";
export const WEB_HOST = import.meta.env.DEV
  ? "http://localhost:5173"
  : "https://satixx-auth.vercel.app";
