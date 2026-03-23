export default function Header() {
  return (
    <header className="bg-[#005868] shadow-lg shadow-[#001f26]/10 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-6 h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/sits logo.png" alt="SITS Group" className="h-9 w-auto" />
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <span className="text-white/80 hover:bg-white/10 transition-colors px-3 py-1 rounded-lg text-xs font-label tracking-wider uppercase cursor-pointer">
            Dashboard
          </span>
          <span className="text-[#D8D800] font-bold px-3 py-1 rounded-lg text-xs font-label tracking-wider uppercase cursor-pointer">
            Assessment
          </span>
          <span className="text-white/80 hover:bg-white/10 transition-colors px-3 py-1 rounded-lg text-xs font-label tracking-wider uppercase cursor-pointer">
            Reports
          </span>
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-white/80 hover:bg-white/10 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
