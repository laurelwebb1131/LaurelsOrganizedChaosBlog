import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/healthz')({
  server: {
    handlers: {
      GET: async () =>
        Response.json(
          {
            ok: true,
            service: "laurels-organized-chaos",
          },
          {
            headers: {
              "cache-control": "no-store",
            },
          },
        ),
    },
  },
})
