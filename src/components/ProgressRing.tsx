type ProgressRingProps = {
  percent: number;
};

export function ProgressRing({ percent }: ProgressRingProps) {
  return (
    <div className="grid size-16 place-items-center rounded-full border border-emerald-300/40 bg-emerald-300/10">
      <div className="text-center">
        <div className="text-lg font-black text-emerald-200">{percent}%</div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/70">
          done
        </div>
      </div>
    </div>
  );
}
