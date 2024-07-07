import TextBox from "../Components/TextBox";
import TextArea from "../Components/TextArea";
import Button from "../Components/Button";
import useUser from "../CustomHooks/useUser";
import { FormEvent, useState } from "react";
import NavBar from "../Components/NavBar";
import { API_HOST } from "../consts/hosts";

function App() {
  const { data, patch } = useUser();

  const [message, setMessage] = useState("");
  const [values, setValues] = useState({
    description: data.description,
    username: data.username,
  });

  const handleDescriptionChange = (newValue: string) => {
    setValues({ ...values, description: newValue });
  };

  const handleUsernameChange = (newValue: string) => {
    setValues({ ...values, username: newValue });
  };

  const handleClick = () => {
    //sends a fetch to logout

    fetch(`${API_HOST}/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          location.href = "/login";
        }
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await patch(values);

    if (result.success) {
      setMessage(result.message);
    } else {
      setMessage(result.message);
    }

    //quits message after a time

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <>
      <NavBar></NavBar>

      <div className=" items-center justify-center h-screen mx-auto flex flex-col">
        <form
          onSubmit={handleSubmit}
          action=""
          className="flex flex-col gap-2 bg-black md:w-[70vw] outline outline-2 outline-neutral-800 rounded-2xl mx-auto px-12 py-3"
        >
          <h1 className="text-2xl py-2 text-left">Profile settings</h1>
          <p className="text-xl py-2 text-left text-opacity-50">Username</p>
          <TextBox
            counter={true}
            limit={20}
            name="username"
            placeholder={data.username ?? "Username"}
            className="w-54"
            onChange={handleUsernameChange}
          ></TextBox>
          <p className="text-xl py-2 text-left text-opacity-50">Description</p>
          <TextArea
            counter={true}
            limit={100}
            onChange={handleDescriptionChange}
            name="description"
            placeholder={data.description ?? "Description"}
          ></TextArea>
          <p className="text-xl py-2 text-left text-opacity-50">Account info:</p>
          <p className="text-md text-left text-neutral-700">
            Created at: {data.created_at}
          </p>
          <p className="text-md text-left text-neutral-700">
            Original username: {data.original_user}
          </p>
          <Button
            title="Save"
            type="submit"
            className="bg-green-600 font-bold w-44 my-2"
          ></Button>
          <p
            className={
              "text-sm text-left " +
              (message === "Data updated" ? "text-green-600" : "text-red-600")
            }
          >
            {message}
          </p>
        </form>
        <Button
          title="Sign out"
          className="mt-4 outline-red-600 bg-red-500 bg-opacity-20 px-4 py-2"
          onClick={handleClick}
        ></Button>
      </div>
    </>
  );
}

export default App;
