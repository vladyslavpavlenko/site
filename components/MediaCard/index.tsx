import Image from "next/image";

export enum MediaCardImageRadius {
  Default = "default",
  Book = "book",
}

interface MediaCardProps {
  image?: {
    alt?: string;
    title?: string;
    src: string;
    width: number;
    height: number;
    radius?: MediaCardImageRadius;
  };
  title?: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  loading?: boolean;
  borderTop?: boolean;
}

const FALLBACK_COVER =
  "data:image/svg+xml,%0A%3Csvg fill='none' height='160' viewBox='0 0 112 160' width='112' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m0 0h112v160h-112z' fill='%2318181b'/%3E%3Cg fill='%23e2e8f0' fill-opacity='.15'%3E%3Ccircle cx='56' cy='57' r='34'/%3E%3Ccircle cx='56' cy='102' r='34'/%3E%3C/g%3E%3C/svg%3E";

export default function MediaCard({
  title,
  subtitle,
  image,
  href,
  hrefLabel,
  loading,
  borderTop,
}: MediaCardProps) {
  const content = (
    <div
      className={`group flex items-center gap-4 ${
        borderTop
          ? `border-t border-solid border-neutral-500/10 pt-4 dark:border-neutral-900`
          : null
      } ${loading ? 'animate-pulse' : ''}`}
    >
      <div className="relative">
        <div className={`relative z-10 origin-center ${loading ? '' : 'drop-shadow-md transition-transform group-hover:rotate-2 group-hover:scale-105'}`}>
          {loading ? (
            <div
              className={`bg-gray-200 dark:bg-zinc-900 ${
                image?.radius === MediaCardImageRadius.Book
                  ? "rounded-l-sm rounded-r"
                  : "rounded"
              }`}
              style={{
                width: `${image?.width || 48}px`,
                height: `${image?.height || 48}px`,
              }}
            />
          ) : (
            <Image
              alt={image?.alt || ""}
              title={title}
              className={`truncate ${
                image?.radius === MediaCardImageRadius.Book
                  ? "rounded-l-sm rounded-r"
                  : "rounded"
              } bg-gray-200 dark:bg-zinc-600`}
              src={image?.src || FALLBACK_COVER}
              width={image?.width}
              height={image?.height}
              priority={false}
            />
          )}
        </div>
      </div>

      <div className="w-full truncate transition-transform">
        {loading ? (
          <>
            <div className="h-5 w-2/3 bg-gray-200 dark:bg-zinc-900 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-900 rounded"></div>
          </>
        ) : (
          <>
            <div className="truncate">{title}</div>
            <div className="truncate text-sm slashed-zero text-neutral-500 [font-variation-settings:'opsz'_14] dark:text-silver-dark">
              {subtitle}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (href && !loading) {
    return (
      <a
        href={href}
        target="_blank"
        title={hrefLabel}
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return content;
}
