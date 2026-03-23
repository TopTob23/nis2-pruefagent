export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 bg-white shadow-[0px_-12px_32px_rgba(0,31,38,0.08)] rounded-t-2xl z-50 border-t border-surface-container-high">
      <div className="flex flex-col items-center justify-center text-slate-500 p-2 rounded-xl">
        <span className="material-symbols-outlined">dashboard</span>
        <span className="text-[10px] font-label mt-1">Dashboard</span>
      </div>
      <div className="flex flex-col items-center justify-center bg-[#D8D800] text-[#003F4B] rounded-xl px-4 py-1 transition-transform active:scale-95">
        <span className="material-symbols-outlined">assignment_turned_in</span>
        <span className="text-[10px] font-label mt-1 font-medium">Assessment</span>
      </div>
      <div className="flex flex-col items-center justify-center text-slate-500 p-2 rounded-xl">
        <span className="material-symbols-outlined">analytics</span>
        <span className="text-[10px] font-label mt-1">Reports</span>
      </div>
    </nav>
  );
}
