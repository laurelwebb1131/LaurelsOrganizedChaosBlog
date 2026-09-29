<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public blog content is queried with the publishable Cloud client and owner edits use RLS with a separate `user_roles` owner row; this keeps draft data private.
- Homepage modules share ordered Cloud tables while site-wide copy lives in a singleton settings row; this keeps the scrapbook editable without code changes.
- Rich post bodies are stored as sanitized HTML from a constrained editor; this supports simple formatting and avoids executing pasted scripts.