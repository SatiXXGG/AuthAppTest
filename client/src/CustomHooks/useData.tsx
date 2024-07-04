import { API_HOST } from "../consts/hosts";

export default async function getData() {
  const data = await fetch(`${API_HOST}/get-user-data`, {
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
  if (!data.success) {
    location.href = "/login";
    return;
  }

  return data;
}
