import PageLogo from "../../logo.webp";

function Logo() {
  return (
    <img
      className="p-4 w-32 mx-auto hover:rotate-180 transition-transform hover:scale-105 "
      src={PageLogo}
    ></img>
  );
}

export default Logo;
