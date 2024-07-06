import ButtonLink from "./ButtonLink";
import TextBox from "./TextBox";

export default function SearchBar() {
  return (
    <div className="flex flex-row px-0 gap-x-3 my-5">
      <TextBox
        className="h-full w-64 md:w-96 -z-10"
        placeholder="Search for a App"
      ></TextBox>
      <ButtonLink
        className="w-24 md:w-40 bg-gray-100 text-neutral-950 font-semibold hover:bg-gray-200 transition-all duration-200"
        title="Add new..."
        to="/create"
      ></ButtonLink>
    </div>
  );
}
