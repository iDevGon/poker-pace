type CardProps = {
  value: string;
};

export function Card({ value }: CardProps) {
  const isRed = value.includes('♥') || value.includes('♦');
  const rank = value.slice(0, -1);
  const suit = value.slice(-1);

  if (!rank || !suit) {
    return (
      <span className="inline-flex aspect-[5/7] h-14 items-center justify-center rounded-[0.45rem] border border-[oklch(62%_0.028_165)] bg-[oklch(93%_0.014_94)] px-2 text-base font-black text-[oklch(18%_0.026_165)]">
        {value}
      </span>
    );
  }

  return (
    <span
      aria-label={value}
      role="img"
      className={`relative inline-flex aspect-[5/7] h-14 shrink-0 rotate-[-1deg] items-center justify-center rounded-[0.45rem] border bg-[oklch(96%_0.012_94)] shadow-[0_0.25rem_0.75rem_oklch(0%_0_0_/_0.16)] ${
        isRed
          ? 'border-[oklch(72%_0.12_24)] text-[oklch(48%_0.17_24)]'
          : 'border-[oklch(62%_0.028_165)] text-[oklch(18%_0.026_165)]'
      }`}
    >
      <span className="absolute left-1 top-1 flex flex-col items-center font-black leading-none">
        <span className="text-[0.68rem]">{rank}</span>
      </span>
      <span className="text-[1.55rem] leading-none">{suit}</span>
      <span className="absolute bottom-1 right-1 flex rotate-180 flex-col items-center font-black leading-none">
        <span className="text-[0.68rem]">{rank}</span>
      </span>
    </span>
  );
}
