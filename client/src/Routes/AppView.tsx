import Alert from "../Components/Alert";
import Button from "../Components/Button";
import NavBar from "../Components/NavBar";
import { API_HOST } from "../consts/hosts";
import useApp from "../CustomHooks/useApp";
import useTickets from "../CustomHooks/useTickets";
import toast from "react-hot-toast";
import sleepGif from "../images/sleep.gif";

export default function AppView() {
  const { app } = useApp();
  const { tickets, reload } = useTickets();

  const onSubmit = async () => {
    const promise = new Promise((resolve, reject) => {
      fetch(`${API_HOST}/app`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: app?.id }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            resolve("App deleted");
            toast.loading("Redirecting...");
            setTimeout(() => (window.location.href = "/home"), 1000);
          } else {
            reject("Error deleting app");
          }
        })
        .catch(() => reject("Error deleting app"));
    });

    toast.promise(promise, {
      loading: "Deleting app...",
      success: "App deleted",
      error: "Error deleting app, try later",
    });
  };
  const onDeny = () => {};

  const { alert, show } = Alert({
    title: "Alert",
    onSubmit,
    onDeny,
  });

  const ticketDelete = (id: string) => {
    const promise = new Promise((resolve, reject) => {
      fetch(`${API_HOST}/app/tickets`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            resolve("Ticket deleted");
            reload();
          } else {
            reject("Error deleting ticket");
          }
        })
        .catch(() => reject("Error deleting ticket"));
    });
    toast.promise(promise, {
      loading: "Deleting ticket...",
      success: "Ticket deleted",
      error: "Error deleting ticket, try later",
    });
  };

  return (
    <main className="relative">
      {alert()}
      <NavBar></NavBar>
      <main className="items-center justify-center w-screen h-screen mx-auto flex flex-col">
        <article className="flex flex-row gap-x-4">
          <section className="bg-neutral-950 outline outline-neutral-800 p-4 outline-1 rounded-xl w-[23rem] md:w-[40rem]">
            <h1 className="text-3xl md:text-4xl pt-2 pb-1 text-left">
              {app?.title ?? "Loading..."}
            </h1>
            <p className="opacity-75 text-left text-xl my-3 break-all">
              {app?.description}
            </p>
            <p className="text-left opacity-35">{app?.created_at}</p>
            <p className="text-left opacity-35 mb-1">{app?.id}</p>
            <div className="flex flex-row my-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    window.location.origin + `/app/${app?.id}/answer`
                  );
                  toast.success("Link copied to clipboard!");
                }}
                className="px-3 py-1 bg-blue-600 w-32 mr-2"
                type="button"
                title="Share"
              ></Button>
              <Button
                className="px-3 py-1 bg-transparent outline-red-600 w-32 mr-2"
                onClick={() =>
                  show("Are you sure do you wanna delete: " + app?.title + "?")
                }
                type="button"
                title="Delete"
              ></Button>
            </div>
          </section>
        </article>
        <article className="bg-neutral-950 outline outline-neutral-800 p-4 outline-2 rounded-xl w-[23rem] md:w-[40rem] my-4">
          <h1 className="text-2xl md:text-4xl pt-2 pb-3 text-left">Tickets</h1>
          {tickets?.length === 0 && (
            <article>
              <p className="text-center text-xl mb-2">There is no tickets yet!</p>
              <img className="mx-auto" src={sleepGif}></img>
            </article>
          )}
          {tickets?.map((ticket) => (
            <article className="bg-neutral-900 rounded-xl p-4 my-2 relative">
              <p className="text-left">{ticket.content}</p>
              <p className="text-sm opacity-50 text-left">{ticket.created_at}</p>
              <button
                className="p-1 bg-red-600 bg-opacity-75 absolute right-2 bottom-2 rounded-md w-8 h-8"
                onClick={async () => await ticketDelete(ticket.id)}
              >
                <svg
                  className="mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#fff"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 7l16 0" />
                  <path d="M10 11l0 6" />
                  <path d="M14 11l0 6" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </button>
            </article>
          ))}
        </article>
      </main>
    </main>
  );
}
