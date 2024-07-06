import { useEffect, useState } from "react";
import { API_HOST } from "../consts/hosts";
import { useParams } from "react-router-dom";
import { appData, fetchSingleAppResult } from "../Types/UserData";

export default function useApp() {
  const [app, setApp] = useState<appData>();
  const { id } = useParams();

  useEffect(() => {
    const fetchApp = async () => {
      const data: fetchSingleAppResult = await fetch(`${API_HOST}/app/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }).then((res) => res.json());

      if (data.success) {
        return setApp(data.data);
      }

      setTimeout(() => {
        fetchApp();
      }, 200);
    };
    fetchApp();
  }, []);

  return { app };
}
