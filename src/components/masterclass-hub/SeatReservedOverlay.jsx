function SeatReservedOverlay() {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm" role="status" aria-live="polite">
      <div className="w-full max-w-[360px] rounded-[18px] bg-white p-6 text-center shadow-[0_24px_70px_rgba(15,23,42,0.32)] ring-1 ring-white/60">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <i className="fas fa-check text-xl" aria-hidden="true" />
        </div>
        <h2 className="m-0 font-heading text-[22px] font-extrabold leading-tight text-[#2A1647]">Seat Reserved</h2>
        <p className="mx-auto mt-2 max-w-[18rem] text-sm leading-relaxed text-slate-600">
          Your details are saved. Taking you to the payment page for the final ₹499 step.
        </p>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-[#EE6662]" />
        </div>
      </div>
    </div>
  );
}

export default SeatReservedOverlay;
