export default function NavLink({ title, href }: { title: string; href: string }) {
  const currentPage = window.location.pathname;
  const styleTo = currentPage === href ? "bg-gray-200 font-semibold text-black" : "";
  return (
    <a
      className={`hover:bg-neutral-900 ${styleTo} transition-all duration-200 active:text-purple-600 active:bg-neutral-800 px-3 py-1 rounded-xl w-24 mr-1`}
      href={href}
    >
      {title}
    </a>
  );
}
