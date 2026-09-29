import { createFileRoute } from '@tanstack/react-router'
import { PostEditor } from '@/components/post-editor'

export const Route = createFileRoute('/admin/posts/$id')({
  component: EditPostPage,
  head: () => ({
    meta: [
      { title: 'Edit Post — Laurel’s Organized Chaos' },
      { name: 'description', content: 'Edit a journal entry.' },
      { property: 'og:title', content: 'Edit Post — Laurel’s Organized Chaos' },
      { property: 'og:description', content: 'Edit a journal entry.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
})

function EditPostPage() {
  const { id } = Route.useParams()
  return <PostEditor id={id} />
}
