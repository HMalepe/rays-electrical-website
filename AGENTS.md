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

- Keep shared site navigation and footer in the root route, with separate content routes, so each page has its own address and metadata.
- Keep business copy and service data in a shared browser-safe data module, so pages use consistent information.
- Enquiries open a prefilled WhatsApp message rather than claiming to submit or store data, because this site has no connected backend.
- Use global semantic tokens and site styles for the visual system, so page components do not embed raw color values.
