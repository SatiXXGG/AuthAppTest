import { ReactNode } from "react";

export default function SettingContainer({
  children,
  title,
}: {
  children: ReactNode[] | ReactNode;
  title: string;
}) {
  return (
    <article className="bg-neutral-950 outline-1 outline outline-neutral-900 p-3 w-96 mx-auto my-4 rounded-2xl">
      <h2 className="text-white font-bold text-xl text-left">{title}</h2>
      {children}
    </article>
  );
}
