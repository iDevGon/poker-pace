type CardProps = {
  value: string;
};

export function Card({ value }: CardProps) {
  const isRed = value.includes('♥') || value.includes('♦');

  return (
    <span
      className={`inline-flex min-h-11 min-w-9 rotate-[-1deg] items-center justify-center rounded-[0.7rem] border bg-[oklch(95%_0.018_94)] px-2 text-base font-black shadow-[0_8px_18px_oklch(8%_0.02_165_/_0.28)] ${
        isRed
          ? 'border-[oklch(72%_0.12_24)] text-[oklch(48%_0.17_24)]'
          : 'border-[oklch(62%_0.028_165)] text-[oklch(18%_0.026_165)]'
      }`}
    >
      {value}
    </span>
  );
}
