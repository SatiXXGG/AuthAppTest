import { Counter } from "./Counter";
import useCounter from "../CustomHooks/useCounter";
import { useRef } from "react";
function TextArea({
  placeholder,
  id = "",
  className = "",
  limit = 100,
  onChange = () => {},
  counter = false,
  name = "",
}: {
  placeholder: string;
  id?: string;
  className?: string;
  name?: string;
  limit?: number;
  counter?: boolean;
  onChange?: (newValue: string) => void;
}) {
  const ref = useRef(null);
  const { getValue } = useCounter({ startValue: 0, maxValue: limit, inputRef: ref });
  return (
    <div className={"flex flex-col my-1" + className}>
      {counter && <Counter value={getValue()} max={limit} />}
      <textarea
        id={id}
        name={name}
        ref={ref}
        maxLength={limit}
        className="max-h-56 min-h-10 px-2 py-2 bg-neutral-900 outline-1 outline-neutral-800 outline w-full mx-auto flex rounded-2xl text-white focus:border-blue-600 "
        placeholder={placeholder}
        onChange={(event) => {
          const target = event.target;

          if (target) {
            onChange(target.value);
          }
        }}
      ></textarea>
    </div>
  );
}

export default TextArea;
