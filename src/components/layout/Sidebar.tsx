"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  ["/dashboard", "Dashboard"], ["/customers", "Customers"], ["/leads", "Leads"], ["/surveys", "Site Surveys"],
  ["/equipment", "Equipment"], ["/quotations", "Quotations"], ["/jobs", "Installation Jobs"],
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="bg-[#0f2a47] text-slate-200 md:min-h-screen md:w-56 md:shrink-0">
      <div className="px-5 py-4 text-lg font-semibold text-white">Solar OS</div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
        {NAV.map(([href, label]) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link key={href} href={href}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm ${active ? "bg-teal-600 text-white" : "hover:bg-white/10"}`}>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
