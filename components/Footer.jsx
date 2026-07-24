import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-[#090d16] border-t border-slate-200 dark:border-slate-800/80 py-8 mt-20 text-slate-500 text-sm transition-colors">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="font-extrabold text-slate-900 dark:text-white tracking-widest text-xs sm:text-sm">
            SPHINIX <span className="text-brand-500">MOBILE</span>
          </span>
          <span className="text-slate-400 dark:text-slate-600">|</span>
          <p style={{ fontSize: "var(--font-size-p-footer, var(--font-size-p-default))" }} className="text-xs text-slate-600 dark:text-slate-400">
            &copy; 2026 Sphinix Mobile. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-6 text-xs sm:text-sm font-medium">
          <Link
            href="/privacy-policy"
            style={{ fontSize: "var(--font-size-link-footer, var(--font-size-link-default))" }}
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            style={{ fontSize: "var(--font-size-link-footer, var(--font-size-link-default))" }}
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/contact-support"
            style={{ fontSize: "var(--font-size-link-footer, var(--font-size-link-default))" }}
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;