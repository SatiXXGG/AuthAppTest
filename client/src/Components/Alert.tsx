import { useEffect, useState } from "react";
import Button from "./Button";

export default function Alert({
  title = "Alert",
  onSubmit = () => {},
  onDeny = () => {},
}: {
  title: string;
  onSubmit: () => void;
  onDeny: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [cc, sc] = useState("hidden");
  const [stateTitle, setTitle] = useState(title);

  useEffect(() => {
    isVisible ? sc("visible w-56") : sc("hidden w-0 h-0");
  }, [isVisible]);

  const functions = {
    show: (title: string) => {
      setTitle(title);
      setIsVisible(true);
      console.log(isVisible);
    },
    alert: () => {
      return (
        <div
          className={
            "absolute z-50 px-6 py-4 bg-neutral-900 outline outline-2 outline-red-900 rounded-xl -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 " +
            cc
          }
        >
          <h1 className="text-left">{stateTitle}</h1>
          <hr className="my-1 opacity-25"></hr>
          <Button
            title="Yes"
            className="my-2 w-16 mx-2"
            onClick={() => {
              setIsVisible(false);
              onSubmit();
            }}
          ></Button>
          <Button
            title="No"
            className="my-2 w-16 mx-2 bg-red-600"
            onClick={() => {
              setIsVisible(false);
              onDeny();
            }}
          ></Button>
        </div>
      );
    },
  };

  return functions;
}
