export default function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-on-surface-variant font-label uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-on-surface-variant/70 mt-1.5 leading-relaxed italic">
          {hint}
        </p>
      )}
    </div>
  );
}
