import { useState } from "react";
import Button from "../Components/Button";
import TextArea from "../Components/TextArea";
import { API_HOST } from "../consts/hosts";
import { useParams } from "react-router-dom";
export default function AnswerTicket() {
  const { id } = useParams();
  const [ticket, setTicket] = useState("");

  const submitItem = async () => {
    const result = await fetch(`${API_HOST}/app/${id}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: ticket }),
    }).then((res) => res.json());

    if (result.success) {
      alert("Ticket submitted!");
    } else {
      alert("Error submitting ticket: " + result.message);
    }
  };

  const ticketChanged = (newText: string) => {
    setTicket(newText);
  };

  return (
    <main className="items-center justify-center w-screen h-screen mx-auto flex flex-col">
      <form onSubmit={submitItem} className="w-96 p-6">
        <h1>Answer ticket</h1>
        <TextArea
          onChange={ticketChanged}
          placeholder="Answer"
          counter
          limit={100}
        ></TextArea>
        <Button
          title="Submit"
          type="submit"
          className="w-32 bg-green-700 bg-opacity-35 outline-1 outline my-2 outline-green-800"
        ></Button>
      </form>
    </main>
  );
}
