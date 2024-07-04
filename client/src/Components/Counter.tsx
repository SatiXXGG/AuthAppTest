export function Counter({ value, max }: { value: number; max: number }) {
  return (
    <div className="flex flex-row py-1">
      <p>{value}/</p>
      <p className="text-red-700">{max}</p>
    </div>
  );
}
