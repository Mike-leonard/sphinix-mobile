import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import InFeedAd from '@/components/ads/InFeedAd';

export default function BlogContent({ blog }) {
  return (
    <>
      <div className="p-6 sm:p-8 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
        <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
          {blog.excerpt}
        </p>

        {/* Mock paragraph content */}
        <p>
          As mobile technology continues to evolve at a breakneck pace, understanding the nuances of {blog.category.toLowerCase()} becomes increasingly critical. This article delves into the foundational shifts we are observing in the industry and how they impact everyday user experiences.
        </p>

        <div className="my-8">
          <InFeedAd />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Deep Dive Analysis</h2>

        <p>
          Looking closely at the architectural decisions made by major manufacturers, it is clear that the focus has shifted from pure theoretical performance to sustained efficiency and thermal management. The integration of neural processing units (NPUs) directly into the die signifies a permanent move toward localized AI workloads.
        </p>

        <p>
          However, this rapid innovation isn't without its challenges. Developers are forced to constantly adapt their applications to leverage these new hardware capabilities, creating a fragmented ecosystem where only the most optimized software truly shines.
        </p>

        <div className="bg-brand-50 dark:bg-brand-500/10 border-l-4 border-brand-500 p-6 rounded-r-xl my-8">
          <p className="italic text-brand-800 dark:text-brand-200 font-medium">
            "The true measure of a device's capability in 2026 isn't benchmark scores, but how seamlessly it manages background intelligence without the user ever noticing."
          </p>
        </div>

        <p>
          In conclusion, whether you are an enthusiast tracking every micro-architecture update or a standard consumer looking for longevity, the current landscape offers unparalleled choice. The convergence of hardware and AI represents a paradigm shift that will dictate device design for the next decade.
        </p>
      </div>

      <div className="p-6 sm:p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0b1120]">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to all articles
        </Link>
      </div>
    </>
  );
}
