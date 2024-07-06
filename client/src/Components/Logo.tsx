import PageLogo from "../../logo.webp";

function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      className={
        "p-4 w-32 mx-auto hover:rotate-180 transition-transform hover:scale-105 " +
        className
      }
      src={PageLogo}
    ></img>
  );
}

export default Logo;
