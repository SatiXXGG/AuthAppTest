import { RefObject, useEffect, useState } from "react";

export default function useCounter({
  startValue,
  maxValue = 10,
  inputRef,
}: {
  startValue: number;
  maxValue?: number;
  inputRef: RefObject<HTMLInputElement>;
}) {
  const [value, setValue] = useState(startValue);

  useEffect(() => {
    if (inputRef.current) {
      const handleInputChange = () => {
        setValue(Number(inputRef.current.value.length));
      };

      inputRef.current.addEventListener("input", handleInputChange);

      return () => {
        inputRef.current?.removeEventListener("input", handleInputChange);
      };
    }
  }, [inputRef]);

  return {
    getValue: () => value,
    getMax: () => maxValue,
  };
}
