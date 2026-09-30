import { HiStar, HiOutlineStar } from "react-icons/hi";

export default function StarRating({ value = 0, size = 13 }) {
  const rounded = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) =>
        i < rounded ? <HiStar key={i} size={size} /> : <HiOutlineStar key={i} size={size} />
      )}
    </span>
  );
}
