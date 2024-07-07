import { useState } from "react";
import Button from "../Components/Button";
import NavBar from "../Components/NavBar";
import TextArea from "../Components/TextArea";
import TextBox from "../Components/TextBox";
import { API_HOST } from "../consts/hosts";
import { fetchResult } from "../Types/UserData";
export function CreateApp() {
  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const onTitleChange = (newValue: string) => {
    setTitle(newValue);
  };

  const onDescriptionChange = (newValue: string) => {
    setDescription(newValue);
  };

  const onCreateApp = async () => {
    const result: fetchResult = await fetch(`${API_HOST}/user/app`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        description,
      }),
    }).then((res) => res.json());

    if (result.success) {
      window.location.href = `/app/${result.data.id}`;
    } else {
      alert(result.message);
    }
  };

  return (
    <>
      <NavBar></NavBar>
      <main className=" items-center justify-center w-screen h-screen mx-auto flex flex-col">
        <section className="w-[90vw] md:w-[20vw] bg-neutral-950 px-5 py-3 rounded-xl">
          <h1 className=" text-left text-2xl font-semibold my-3">Create App</h1>
          <TextBox
            className="w-full"
            placeholder="App Name"
            onChange={onTitleChange}
            limit={20}
            counter
          ></TextBox>
          <TextArea
            className="w-full"
            placeholder="App Description"
            limit={100}
            onChange={onDescriptionChange}
            counter
          ></TextArea>
          <Button
            onClick={onCreateApp}
            title="Create"
            className="my-2 w-full bg-green-600"
          ></Button>
        </section>
      </main>
    </>
  );
}

export default CreateApp;
