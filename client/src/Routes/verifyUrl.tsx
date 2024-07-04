import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_HOST } from "../consts/hosts";
import { useState } from "react";

export default function VerifyUrl() {
  const { code, id } = useParams();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (code && id) {
      fetch(`${API_HOST}/verify-url/${id}/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          code: code,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.success) {
            if (res.message === "Already verified") {
              // return (window.location.href = "/home");
            }
            setVerified(true);
          }
        });
    }
  }, [code, id]);

  return (
    <main className=" items-center justify-center h-screen mx-auto flex flex-col">
      <div className="bg-black outline outline-neutral-800 p-4 outline-2 rounded-xl w-72 h-auto">
        <h1 className="font-bold my-2">
          {verified ? "Email Verified!" : "Email not verified, try again later"}
        </h1>
        {verified ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="75"
            height="75"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#00b341"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="mx-auto my-2"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M9 12l2 2l4 -4" />
          </svg>
        ) : (
          <svg
            className="mx-auto my-2"
            xmlns="http://www.w3.org/2000/svg"
            width="75"
            height="75"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#ff2825"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        )}
        {verified ? (
          <a className="text-purple-700" href="/home">
            Go home
          </a>
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}
