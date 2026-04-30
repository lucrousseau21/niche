export default function FeatureCard({
  title,
  desc,
  icon,
  slug,
}: {
  title: string;
  desc: string;
  icon?: React.ReactNode;
  slug?: string;
}) {
  const inner = (
    <>
      <div className="w-12 h-12 rounded-xl bg-green-200/50 flex items-center justify-center text-forest">
        {icon ?? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-xl text-forest mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </>
  );

  if (slug) {
    return (
      <a
        href={`/blog/${slug}`}
        className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 hover:border-green-200 transition-all duration-300 h-full flex flex-col items-start gap-4 cursor-pointer"
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-start gap-4">
      {inner}
    </div>
  );
}
