import caffeine from "../../assets/caffeine.svg?raw";

export default function Caffeine({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block [&>svg]:h-auto [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: caffeine }}
    />
  );
}