export default function Avatar({ name, size = 'md', className = '' }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const sizes = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-12 w-12 text-base' };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 font-semibold text-white ${sizes[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
