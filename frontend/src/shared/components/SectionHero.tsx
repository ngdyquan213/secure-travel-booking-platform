import type { ReactNode } from 'react';

interface SectionHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  cta?: {
    text: string;
    href: string;
  };
  children?: ReactNode;
}

export function SectionHero({
  title,
  subtitle,
  backgroundImage,
  cta,
  children,
}: SectionHeroProps) {
  return (
    <section
      className="relative min-h-96 flex items-center justify-center text-center px-4 py-24"
      style={{
        backgroundImage: backgroundImage
          ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 -z-10" />
      )}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-gray-600 mb-8 text-pretty">
            {subtitle}
          </p>
        )}
        {children}
        {cta && (
          <div className="mt-8">
            <a
              href={cta.href}
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {cta.text}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
