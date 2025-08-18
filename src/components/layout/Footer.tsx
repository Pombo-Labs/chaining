import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            <Link 
              href="/docs" 
              className="text-gray-500 hover:text-black text-sm transition-colors"
            >
              Docs
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-500 hover:text-black text-sm transition-colors"
            >
              Privacy
            </Link>
          </div>
          <p className="text-gray-400 text-sm text-center">
            © 2025 By Pombo Labs. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
