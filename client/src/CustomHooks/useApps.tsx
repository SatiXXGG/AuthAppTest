import { useEffect, useState } from "react";
import { appData, fetchAppResult } from "../Types/UserData";
import { API_HOST } from "../consts/hosts";
import { DEFAULT_FETCH_TIME } from "../settings/content_loading";

export default function useApps() {
  const [apps, setApps] = useState<appData[]>();

  useEffect(() => {
    const fetchApps = async () => {
      const apps: fetchAppResult = await fetch(`${API_HOST}/user/app`, {
        credentials: "include",
        method: "GET",
      }).then((res) => res.json());

      if (!apps.success) {
        setTimeout(() => fetchApps(), DEFAULT_FETCH_TIME);
        return;
      }

      setApps(apps.data);
    };
    fetchApps();
  }, []);

  return { apps };
}
