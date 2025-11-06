'use client'

import dynamic from 'next/dynamic'

const TipTapRenderer = dynamic(() => import('@/components/TipTapRenderer'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  ),
})

interface BlogContentProps {
  content: any
  excerpt?: string
}

export default function BlogContent({ content, excerpt }: BlogContentProps) {
  return (
    <div className="prose prose-base sm:prose-lg max-w-none">
      {content ? (
        <TipTapRenderer content={content} />
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            {excerpt || "Discover our latest insights in sustainable carbon production and water treatment technology."}
          </p>
        </div>
      )}
    </div>
  )
}
