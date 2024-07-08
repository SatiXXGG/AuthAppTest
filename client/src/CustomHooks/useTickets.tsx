import { useEffect, useState } from "react";
import { API_HOST } from "../consts/hosts";
import { useParams } from "react-router-dom";
import { ticket } from "../Types/UserData";

export default function useTickets() {
  const [tickets, setTickets] = useState<ticket[]>([]);
  const { id } = useParams();

  const fetchTickets = async () => {
    const data = await fetch(`${API_HOST}/app/${id}/tickets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => res.json());

    if (data.success) {
      return setTickets(data.data);
    }

    setTimeout(() => {
      fetchTickets();
    }, 200);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const reload = () => {
    fetchTickets();
  };

  return { tickets, reload };
}
