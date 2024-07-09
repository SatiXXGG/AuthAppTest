import { FormEventHandler, useState } from "react";
import TextBox from "../Components/TextBox";
import Button from "../Components/Button";
import Logo from "../Components/Logo";
import { API_HOST, WEB_HOST } from "../consts/hosts";

function Register() {
  const [text, setText] = useState<string>("");

  const updateText = (text: string) => {
    setText(text);
    setTimeout(() => setText(""), 2000);
  };

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const username = document.getElementById("username") as HTMLInputElement;
    const password1 = document.getElementById("password1") as HTMLInputElement;
    const password2 = document.getElementById("password2") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;

    if (email.value === "") {
      updateText("Email cannot be empty");
      return;
    }

    if (username.value === "") {
      updateText("Username cannot be empty");
      return;
    }

    if (username.value.length < 4) {
      updateText("Username must be at least 5 characters long");
      return;
    }

    if (password1.value !== password2.value) {
      updateText("Passwords do not match");
      return;
    }

    if (password2.value.length < 6) {
      updateText("Password must be at least 7 characters long");
      return;
    }

    const registerResult = await fetch(`${API_HOST}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: username.value,
        password: password1.value,
        email: email.value,
        host_url: WEB_HOST,
      }),
    }).then((res) => res.json());

    if (registerResult.success) {
      location.href = "/login";
    }
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
          id="email"
          type="email"
          placeholder="Email"
        ></TextBox>
        <TextBox
          className="py-2"
          id="password2"
          type="password"
          placeholder="Password"
        ></TextBox>
        <TextBox
          className="py-2"
          id="password1"
          type="password"
          placeholder="Confirm Password"
        ></TextBox>

        <Button
          type="submit"
          title="Submit"
          className="w-full my-2 hover:outline-2 hover:outline-purple-700 transition-all duration-100 bg-black"
        ></Button>

        {text !== "" ? <p className="text-red-400 text-sm">{text}</p> : <></>}

        <p>
          Already have an account?{" "}
          <a className="text-purple-700" href="/login">
            Login
          </a>
        </p>
      </form>
    </main>
  );
}

export default Register;
