import { HiOutlinePhone, HiOutlineMail, HiOutlineClock } from "react-icons/hi";
import type { ReactNode } from "react";

export default function ContactPage() {
  return (
    <div className="container-page py-16 max-w-lg">
      <h1 className="font-display text-3xl mb-2">Support, 24/7</h1>
      <p className="text-ink-soft mb-8">
        Have a question about an order, a product, or your account? Reach us any time.
      </p>
      <div className="space-y-5">
        <ContactRow icon={<HiOutlinePhone size={20} />} label="Phone" value="+20 123 456 7890" />
        <ContactRow icon={<HiOutlineMail size={20} />} label="Email" value="support@shopmart.com" />
        <ContactRow icon={<HiOutlineClock size={20} />} label="Hours" value="Available around the clock, every day" />
      </div>
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 border border-line rounded-xl p-4">
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-ink-soft">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
