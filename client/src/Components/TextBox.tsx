import { useRef } from "react";
import useCounter from "../CustomHooks/useCounter";
import { Counter } from "./Counter";
import VariableSvg from "./VariableSvg";

function TextBox({
  placeholder,
  type = "",
  id = "",
  className = "",
  limit = 100,
  counter = false,
  name = "",
  onChange = () => {
    return "";
  },
}: {
  placeholder: string;
  type?: string;
  id?: string;
  name?: string;
  className?: string;
  limit?: number;
  counter?: boolean;
  onChange?: (newValue: string) => string | void;
}) {
  const item = useRef(null);
  const { getValue } = useCounter({
    startValue: 0,
    maxValue: limit,
    inputRef: item,
  });

  return (
    <div className={"flex flex-col relative " + className}>
      {counter && <Counter value={getValue()} max={limit} />}
      <input
        ref={item}
        id={id}
        name={name}
        type={type}
        maxLength={limit}
        className="px-2 py-2 bg-neutral-900 outline-1 outline-neutral-800 outline w-full mx-auto flex rounded-2xl text-white focus:border-blue-600 focus:border-3 focus:border "
        placeholder={placeholder}
        onChange={(event) => {
          const target = event.target;

          if (target) {
            onChange(target.value);
          }
        }}
      ></input>
      <VariableSvg
        className="absolute right-3 top-1/2 -translate-y-1/2"
        id={id}
      ></VariableSvg>
    </div>
  );
}

export default TextBox;
