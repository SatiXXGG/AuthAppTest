import Button from "../Components/Button";
import Logo from "../Components/Logo";
import TextBox from "../Components/TextBox";
import { API_HOST } from "../consts/hosts";

function Verify() {
  const handleVerifySubmit = () => {
    const code = document.getElementById("code") as HTMLInputElement;

    if (code.value.length < 1) {
      return;
    }

    fetch(`${API_HOST}/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code: code.value }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          alert("Email verified");
          location.href = "/login";
        }
      });
  };

  return (
    <main className="items-center justify-center h-screen mx-auto flex flex-col">
      <div className="bg-black outline outline-neutral-800 p-4 outline-2 rounded-xl w-72 h-auto">
        <h1 className="text-xl">Verify email</h1>
        <Logo></Logo>
        <TextBox id="code" placeholder="Code Ex: 9473"></TextBox>
        <Button
          onClick={handleVerifySubmit}
          title="Verify"
          className="w-full my-2"
        ></Button>
      </div>
    </main>
  );
}

export default Verify;
