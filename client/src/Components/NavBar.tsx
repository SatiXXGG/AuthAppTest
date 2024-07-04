import useUser from "../CustomHooks/useUser";

export default function NavBar() {
  const { data } = useUser();

  return (
    <nav className="bg-neutral-950 w-full py-3 flex flec-row relative">
      <h1 className="text-xl font-bold px-12 absolute left-5  -translate-y-1/2 top-1/2">
        {data.username}
      </h1>
      <section className="mx-auto flex flex-row justify-center">
        <a href="/home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#6f32be"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M19.072 21h-14.144a1.928 1.928 0 0 1 -1.928 -1.928v-6.857c0 -.512 .203 -1 .566 -1.365l7.07 -7.063a1.928 1.928 0 0 1 2.727 0l7.071 7.063c.363 .362 .566 .853 .566 1.365v6.857a1.928 1.928 0 0 1 -1.928 1.928z" />
            <path d="M7 13v4h10v-4l-5 -5" />
            <path d="M14.8 5.2l-11.8 11.8" />
            <path d="M7 17v4" />
            <path d="M17 17v4" />
          </svg>
        </a>

        <a href="/settings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#6f32be"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
            <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
          </svg>
        </a>
      </section>
    </nav>
  );
}
