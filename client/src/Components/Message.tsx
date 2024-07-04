export default function Message({
  message,
  from = "jhon-doe",
}: {
  message: string;
  from?: string;
}) {
  const newClass =
    from === "You" ? "translate-x-24 bg-purple-700" : "-translate-x-24";
  return (
    <div
      className={
        "bg-neutral-950 text-left min-w-40 outline-neutral-800 outline outline-1 p-4 mb-2 mt-4 max-w-96 mx-auto rounded-2xl " +
        newClass
      }
    >
      <section className="flex flex-row justify-between">
        <h1 className="text-xl">{from}</h1>
        <p className="text-sm text-gray-400">{"8:51 10/10/23"}</p>
      </section>
      <p className="text-md text-left text-white">{message}</p>
    </div>
  );
}
