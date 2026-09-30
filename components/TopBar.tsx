import { HiOutlineTruck, HiOutlineGift, HiOutlinePhone, HiOutlineMail } from "react-icons/hi";

export default function TopBar({ isAuthed }: { isAuthed: boolean }) {
  return (
    <div className="hidden sm:block border-b border-line bg-paper-raised text-xs">
      <div className="container-page h-10 flex items-center justify-between">
        <div className="flex items-center gap-6 text-ink-soft">
          <span className="flex items-center gap-1.5">
            <HiOutlineTruck className="text-primary" size={15} /> Free shipping on orders over 500 EGP
          </span>
          <span className="hidden lg:flex items-center gap-1.5">
            <HiOutlineGift className="text-accent" size={15} /> New arrivals every week
          </span>
        </div>
        <div className="flex items-center gap-5 text-ink-soft">
          <a href="tel:+201234567890" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <HiOutlinePhone size={14} className="text-primary" /> +20 123 456 7890
          </a>
          <a href="mailto:support@shopmart.com" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <HiOutlineMail size={14} className="text-primary" /> support@shopmart.com
          </a>
          {!isAuthed && (
            <>
              <span className="w-px h-3.5 bg-line" />
              <div className="flex items-center gap-3">
                <a href="/login" className="text-primary hover:underline">Sign in</a>
                <a href="/register" className="text-primary hover:underline">Sign up</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
