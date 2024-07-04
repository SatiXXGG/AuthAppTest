export default function ButtonLink({ to, title }: { to: string; title: string }) {
  return (
    <a
      className="bg-black px-2 py-1 rounded-xl outline outline-1 outline-neutral-950 hover:scale-105 active:outline-white transition-all z-20 text-xl"
      href={to}
    >
      {title}
    </a>
  );
}
