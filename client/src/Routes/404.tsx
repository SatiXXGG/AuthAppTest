import ButtonLink from "../Components/ButtonLink";
import notFound from "../images/not-found.gif";

export default function NotFound() {
  return (
    <div className="w-screen h-screen items-center justify-center flex">
      <div className=" flex flex-col px-4 py-7 rounded-2xl">
        <h1 className="text-4xl text-red-600">404</h1>
        <h2 className="text-md mt-2">Page not found</h2>
        <img className="w-56 mt-2 rounded-2xl" src={notFound}></img>
        <ButtonLink
          title="Go home"
          to="/home"
          className="mt-6 w-32 mx-auto"
        ></ButtonLink>
      </div>
    </div>
  );
}
