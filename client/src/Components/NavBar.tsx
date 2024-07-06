import useUser from "../CustomHooks/useUser";
import Logo from "./Logo";
import NavLink from "./NavLink";

export default function NavBar() {
  const { data } = useUser();
  return (
    <nav className="bg-neutral-950 gap-y-3 w-full py-3 flex flex-col px-3 absolute ">
      <div className="flex flex-row ml-1 mr-auto h-13">
        <Logo className="mx-0 w-6 h-6 my-auto px-0 py-0"></Logo>
        <h1 className="px-2 my-auto text-xl text-purple-600">/</h1>
        <h1 className="my-auto text-xl font-semibold text-left">
          {data.username ?? "Loading..."}
        </h1>
        <div className="bg-green-600 outline-1 outline outline-green-500 text-sm my-auto px-2 py-0.5 rounded-3xl bg-opacity-75 mx-2">
          <h1>Free tier</h1>
        </div>
      </div>
      <section className="flex flex-row">
        <NavLink title="Home" href="/home"></NavLink>
        <NavLink title="Settings" href="/settings"></NavLink>
      </section>
    </nav>
  );
}
