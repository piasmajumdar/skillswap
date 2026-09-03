"use client";

import React from "react";

const toneStyles = {
  indigo: {
    shell: "from-indigo-500/12 via-indigo-500/6 to-white",
    icon: "bg-indigo-600 text-white",
    ring: "ring-indigo-100",
  },
  emerald: {
    shell: "from-emerald-500/12 via-emerald-500/6 to-white",
    icon: "bg-emerald-600 text-white",
    ring: "ring-emerald-100",
  },
  amber: {
    shell: "from-amber-500/12 via-amber-500/6 to-white",
    icon: "bg-amber-600 text-white",
    ring: "ring-amber-100",
  },
  rose: {
    shell: "from-rose-500/12 via-rose-500/6 to-white",
    icon: "bg-rose-600 text-white",
    ring: "ring-rose-100",
  },
  slate: {
    shell: "from-slate-500/12 via-slate-500/6 to-white",
    icon: "bg-slate-700 text-white",
    ring: "ring-slate-200",
  },
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  tone = "indigo",
  helperText,
}) => {
  const styles = toneStyles[tone] || toneStyles.indigo;

  return (
    <article
      className={`
                rounded-2xl border border-slate-200 bg-gradient-to-br ${styles.shell}
                p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
            `}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>

          {helperText ? (
            <p className="mt-2 text-xs text-slate-500">{helperText}</p>
          ) : null}
        </div>

        {Icon ? (
          <div
            className={`
                            flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl
                            shadow-sm ring-1 ${styles.icon} ${styles.ring}
                        `}
          >
            <Icon size={18} />
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default StatCard;
