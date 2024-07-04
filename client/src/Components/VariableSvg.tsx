import CardSvg from "../Svgs/Card";
import EmailSvg from "../Svgs/Email";
import PasswordSvg from "../Svgs/Password";

function VariableSvg({ className, id }: { className?: string; id: string }) {
  return (
    <>
      {id.includes("password") ? (
        <PasswordSvg className={className ?? ""}></PasswordSvg>
      ) : (
        <></>
      )}

      {id.includes("email") ? (
        <EmailSvg className={className ?? ""}></EmailSvg>
      ) : (
        <></>
      )}

      {id.includes("username") ? (
        <CardSvg className={className ?? ""}></CardSvg>
      ) : (
        <></>
      )}
    </>
  );
}

export default VariableSvg;
