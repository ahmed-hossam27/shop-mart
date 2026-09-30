import {
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineRefresh,
  HiOutlineSupport,
} from "react-icons/hi";

const ITEMS = [
  {
    icon: <HiOutlineTruck size={20} />,
    title: "Free Shipping",
    text: "On orders over 500 EGP",
    color: "#3b82f6",
  },
  {
    icon: <HiOutlineShieldCheck size={20} />,
    title: "Secure Payment",
    text: "100% secure transactions",
    color: "#22c55e",
  },
  {
    icon: <HiOutlineRefresh size={20} />,
    title: "Easy Returns",
    text: "14-day return policy",
    color: "#f97316",
  },
  {
    icon: <HiOutlineSupport size={20} />,
    title: "24/7 Support",
    text: "Dedicated support team",
    color: "#a855f7",
  },
];

export default function FeatureBar({ className = "", bordered = true }) {
  return (
    <div className={`container-page py-8 ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className={`flex items-center gap-3 rounded-xl p-4 bg-paper-raised ${
              bordered ? "border border-line shadow-sm hover:shadow-md transition-shadow" : ""
            }`}
          >
            <div
              className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${item.color}1a`, color: item.color }}
            >
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm leading-tight">{item.title}</p>
              <p className="text-xs text-ink-soft leading-tight mt-0.5">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
