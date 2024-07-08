import { appData } from "../Types/UserData";

export default function AppSection({ title, description, id, created_at }: appData) {
  return (
    <a
      className="w-full rounded-2xl outline outline-1 outline-neutral-900 bg-neutral-950 p-6 max-h-46 hover:scale-[102%]"
      href={`/apps/${id}`}
    >
      <h1 className="text-xl md:text-2xl font-bold text-left mb-1">{title}</h1>
      <p className="break-all text-md overflow-ellipsis opacity-75 text-left mb-2  md:text-base">
        {description}
      </p>
      <p className="text-xs opacity-50 text-left">{"Id: " + id}</p>
      <p className="text-xs opacity-50 text-left">{"Created at: " + created_at}</p>
    </a>
  );
}
