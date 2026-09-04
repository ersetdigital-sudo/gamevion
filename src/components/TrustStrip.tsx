export default function TrustStrip() {
  const stats = [
    { value: "1.2 jt+", label: "top up udah masuk" },
    { value: "4.9", suffix: "/5", label: "rating pemain" },
    { value: "6", label: "game siap top up" },
    { value: "24/7", label: "CS standby terus" },
  ];

  return (
    <div className="border-y border-white/10 bg-[color:var(--panel)]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-white/10 px-4 sm:grid-cols-4 sm:divide-y-0 sm:px-6">
        {stats.map((stat, i) => (
          <div key={i} className="py-5 px-4">
            <p className="disp text-xl font-bold text-white sm:text-2xl">
              {stat.value}
              {stat.suffix && (
                <span className="text-[color:var(--em)]">{stat.suffix}</span>
              )}
            </p>
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
