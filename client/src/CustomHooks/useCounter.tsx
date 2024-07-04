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
    const inputElement = inputRef.current;
    if (inputElement) {
      const handleInputChange = () => {
        setValue(Number(inputRef.current?.value.length));
      };
      inputElement.addEventListener("input", handleInputChange);
      return () => {
        inputElement.removeEventListener("input", handleInputChange);
      };
    }
  }, [inputRef]);

  return {
    getValue: () => value,
    getMax: () => maxValue,
  };
}
