import toast, { type Renderable, type Toast, type ToastOptions } from "react-hot-toast";
import { HiCheckCircle, HiXCircle, HiX } from "react-icons/hi";

const DURATION = 3200;

interface NotifyOptions extends ToastOptions {
  kind?: "success" | "error";
}

function render(message: string, { kind }: NotifyOptions): (t: Toast) => Renderable {
  const isSuccess = kind === "success";
  // eslint-disable-next-line react/display-name
  return (t: Toast) => (
    <div className="relative min-w-[240px] max-w-sm bg-paper-raised border border-line rounded-lg shadow-lg overflow-hidden pointer-events-auto">
      <div className="flex items-start gap-2.5 px-4 py-3">
        {isSuccess ? (
          <HiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={20} />
        ) : (
          <HiXCircle className="text-danger shrink-0 mt-0.5" size={20} />
        )}
        <p className="text-sm text-ink flex-1">{message}</p>
        <button
          onClick={() => toast.dismiss(t.id)}
          aria-label="Dismiss"
          className="text-ink-soft hover:text-ink shrink-0"
        >
          <HiX size={16} />
        </button>
      </div>
      <div className="h-1 bg-line">
        <div
          className={`h-full ${isSuccess ? "bg-emerald-500" : "bg-danger"}`}
          style={{ animation: `toast-shrink ${DURATION}ms linear forwards` }}
        />
      </div>
    </div>
  );
}

export function notifySuccess(message: string, options: ToastOptions = {}) {
  return toast.custom(render(message, { kind: "success", ...options }), {
    duration: DURATION,
    ...options,
  });
}

export function notifyError(message: string, options: ToastOptions = {}) {
  return toast.custom(render(message, { kind: "error", ...options }), {
    duration: DURATION,
    ...options,
  });
}
