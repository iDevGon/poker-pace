type CardProps = {
  value: string;
};

export function Card({ value }: CardProps) {
  const isRed = value.includes('♥') || value.includes('♦');

  return (
    <span
      className={`inline-flex min-h-10 min-w-8 items-center justify-center rounded-lg border bg-stone-100 px-2 text-base font-black shadow-sm ${
        isRed
          ? 'border-red-200 text-red-600'
          : 'border-stone-300 text-stone-950'
      }`}
    >
      {value}
    </span>
  );
}
