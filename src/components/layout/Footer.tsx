import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[#262626] bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-bold text-lg text-white">
            Dan<span className="text-blue-400">.</span>
          </Link>
          <p className="text-gray-500 text-sm">
            &copy; {year} Dan. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/albums" className="text-gray-500 hover:text-white text-sm transition-colors">
              Albums
            </Link>
            <Link href="/about" className="text-gray-500 hover:text-white text-sm transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-500 hover:text-white text-sm transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
