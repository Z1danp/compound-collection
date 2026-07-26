import renikLogo from '../../assets/renik.svg?raw';

export default function RenikLogo({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block [&>svg]:h-auto [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: renikLogo }}
    />
  );
}
