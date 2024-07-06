import Button from "../Components/Button";
import NavBar from "../Components/NavBar";
import useApp from "../CustomHooks/useApp";
import useTickets from "../CustomHooks/useTickets";

export default function AppView() {
  const { app } = useApp();
  const { tickets } = useTickets();
  console.log(tickets);

  return (
    <>
      <NavBar></NavBar>
      <main className="items-center justify-center w-screen h-screen mx-auto flex flex-col">
        <article className="flex flex-row gap-x-4">
          <section className="bg-neutral-950 outline outline-neutral-800 p-4 outline-2 rounded-xl w-[24rem]">
            <h1 className="text-4xl pt-2 pb-3 text-left">{app?.title}</h1>
            <p className="text-left text-xl my-3">{app?.description}</p>
            <p>
              Share this link with other users to answer!:{" "}
              <p>{`${window.location.origin}/app/${app?.id}/answer`}</p>
            </p>
            <p className="text-left opacity-35">{app?.created_at}</p>
            <p className="text-left opacity-35">{app?.id}</p>
          </section>
          <section className="bg-neutral-950 outline outline-neutral-800 p-4 outline-2 rounded-xl w-[10rem]">
            <Button
              title="Delete"
              className="w-full bg-red-700 bg-opacity-30 outline outline-red-900 outline-1"
            ></Button>
          </section>
        </article>
        <article className="bg-neutral-950 outline outline-neutral-800 p-4 outline-2 rounded-xl w-[35rem] my-4">
          <h1 className="text-4xl pt-2 pb-3 text-left">Tickets</h1>
          {tickets?.map((ticket) => (
            <div className="bg-neutral-900 rounded-xl p-4 my-2">
              <p className="text-left">{ticket.content}</p>
              <p className="text-sm opacity-50 text-left">{ticket.created_at}</p>
            </div>
          ))}
        </article>
      </main>
    </>
  );
}
