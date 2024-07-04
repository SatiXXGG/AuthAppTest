export default function Button({
  type = "button",
  title = "button",
  onClick = () => {},
  className = "",
}: {
  type?: "submit" | "button" | "reset";
  title: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      className={
        "bg-neutral-900 outline-1 outline outline-neutral-800 px-2 py-1 text-md text-white rounded-xl " +
        className
      }
      type={type}
      onClick={onClick}
    >
      {title}
    </button>
  );
}
