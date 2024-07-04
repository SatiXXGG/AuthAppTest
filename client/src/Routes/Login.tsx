import { FormEventHandler, useState } from "react";
import TextBox from "../Components/TextBox";
import Button from "../Components/Button";
import Logo from "../Components/Logo";
import { API_HOST } from "../consts/hosts";

function Login() {
  const [text, setText] = useState<string>("");

  const updateText = (text: string) => {
    setText(text);
    setTimeout(() => setText(""), 2000);
  };

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const username = document.getElementById("username") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    if (username.value === "") {
      updateText("Username cannot be empty");
      return;
    }

    if (password.value === "") {
      updateText("Password cannot be empty");
      return;
    }

    const registerResult = await fetch(`${API_HOST}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        user: username.value,
        password: password.value,
      }),
    }).then((res) => res.json());

    if (registerResult.success) {
      return (location.href = "/home");
    }

    if (registerResult.message === "Email not verified") {
      return (location.href = "/verify-email");
    }

    updateText(registerResult.message);
  };

  return (
    <main className=" items-center justify-center h-screen mx-auto flex flex-col">
      <form
        onSubmit={submit}
        className="bg-black outline outline-neutral-800 p-4 outline-2 rounded-xl w-72 h-auto"
      >
        <Logo></Logo>
        <TextBox className="py-2" id="username" placeholder="Username"></TextBox>
        <TextBox
          className="py-2"
          id="password"
          type="password"
          placeholder="Password"
        ></TextBox>

        <Button
          type="submit"
          title="Submit"
          className=" px-12 w-full my-2 hover:outline-2 hover:outline-purple-700 transition-all duration-100 bg-black"
        ></Button>

        <p>
          Don't have an account?{" "}
          <a className="text-purple-700" href="/register">
            Register
          </a>
        </p>

        {text !== "" ? <p className="text-red-400 text-sm">{text}</p> : <></>}
      </form>
    </main>
  );
}

export default Login;
