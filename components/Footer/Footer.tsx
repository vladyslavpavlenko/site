import Link from "next/link";
import { IoPinSharp as PlanetIcon } from "react-icons/io5"

export default function Footer() {
  return (
    <footer className="m:px-0 flex w-full justify-center pt-10 sm:pt-20">
      <div className="max-w-main flex-1">
        <div className="flex w-full items-center justify-between border-t border-solid border-neutral-500/10 pt-8 dark:border-neutral-900">
          <div>
            <ul className="flex gap-4">
              <li>
                <Link href="/" className="link-fade">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/posts" className="link-fade">
                  Posts
                </Link>
              </li>
              <li>
                <Link href="/library" className="link-fade">
                  Library
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-neutral-500 [font-variation-settings:'opsz'_12] dark:text-silver-dark">
            <PlanetIcon size={16}/>
            Made in Kyiv, Ukraine
          </div>
        </div>
      </div>
    </footer>
  );
}
