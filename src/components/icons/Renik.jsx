import renik from '../../assets/login.svg?raw';

export default function Renik({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block [&>svg]:h-auto [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: renik }}
    />
  );
}
