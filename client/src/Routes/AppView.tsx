import Alert from "../Components/Alert";
import Button from "../Components/Button";
import NavBar from "../Components/NavBar";
import useApp from "../CustomHooks/useApp";
import useTickets from "../CustomHooks/useTickets";
export default function AppView() {
  const { app } = useApp();
  const { tickets } = useTickets();

  const onSubmit = () => {};
  const onDeny = () => {};

  const { alert, show } = Alert({
    title: "Alert",
    onSubmit,
    onDeny,
  });

  return (
    <main className="relative">
      {alert()}
      <p>{`${window.location.origin}/app/${app?.id}/answer`}</p>

      <NavBar></NavBar>
      <main className="items-center justify-center w-screen h-screen mx-auto flex flex-col">
        <article className="flex flex-row gap-x-4">
          <section className="bg-neutral-950 outline outline-neutral-800 p-4 outline-1 rounded-xl w-[23rem] md:w-[40rem]">
            <h1 className="text-3xl md:text-4xl pt-2 pb-1 text-left">{app?.title}</h1>
            <p className="opacity-75 text-left text-xl my-3">{app?.description}</p>
            <p className="text-left opacity-35">{app?.created_at}</p>
            <p className="text-left opacity-35 mb-1">{app?.id}</p>
            <div className="flex flex-row my-2">
              <Button
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
          {tickets?.map((ticket) => (
            <div className="bg-neutral-900 rounded-xl p-4 my-2">
              <p className="text-left">{ticket.content}</p>
              <p className="text-sm opacity-50 text-left">{ticket.created_at}</p>
            </div>
          ))}
        </article>
      </main>
    </main>
  );
}
