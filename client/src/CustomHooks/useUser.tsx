import { useEffect, useState } from "react";
import { fetchResult, userData } from "../Types/UserData";
import { API_HOST } from "../consts/hosts";

export default function useUser() {
  const [userData, setData] = useState({} as userData);

  useEffect(() => {
    const fetchUserData = async () => {
      const data: fetchResult = await fetch(`${API_HOST}/user`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());

      if (!data.success) {
        const refreshToken: fetchResult = await fetch(`${API_HOST}/user/token`, {
          method: "POST",
          credentials: "include",
        }).then((res) => res.json());

        if (!refreshToken.success) {
          return (location.href = "/login");
        }

        setTimeout(() => fetchUserData(), 200);
        return;
      }

      setData(data.data);
    };

    fetchUserData();
  }, []);

  const patchUserData = async (data: userData) => {
    const response = await fetch(`${API_HOST}/user`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const jsonResult = await response.json();
    return jsonResult;
  };

  return {
    data: userData,
    success: true,
    patch: patchUserData,
  };
}
