export default function ButtonLink({
  to,
  title,
  className,
}: {
  to: string;
  title: string;
  className?: string;
}) {
  return (
    <a
      className={
        "bg-neutral-900 outline-1 outline outline-neutral-800 px-2  py-2 text-md text-white rounded-xl " +
        className
      }
      href={to}
    >
      {title}
    </a>
  );
}
