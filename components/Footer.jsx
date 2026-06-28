

function Footer() {
  return (
      <footer className="bg-slate-950 border-t border-slate-900 py-10 mt-20 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-widest text-sm">SPHINIX <span className="text-brand-500">MOBILE</span></span>
            <span>|</span>
            <p className="text-xs">&copy; 2026 Sphinix Mobile. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-xs font-semibold">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
  )
}

export default Footer