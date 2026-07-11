# Notes: hand-built vs. shadcn/ui

A caveat first: this sandbox has no network access, so I couldn't actually run
`pnpm dlx shadcn@latest add dialog` or install `@radix-ui/react-dialog`.
`src/shadcn-reference/dialog.tsx` and `tabs.tsx` are transcribed from the
current, documented shadcn/ui registry source rather than freshly generated —
close to what the CLI would produce, but you should run the real install
locally to confirm before relying on this comparison for a real project.

## What shadcn handled that I missed

1. **Focus trapping is far more robust.** My `Modal.tsx` grabs a static
   `querySelectorAll` snapshot of focusable elements on every Tab keydown. If
   the dialog's content changes while open (an item gets added or disabled),
   my trap can drift. shadcn's `Dialog` delegates to Radix's `FocusScope`,
   which re-derives the tabbable set dynamically and also handles edge cases
   like zero focusable elements or focus moving via scripting, not just Tab.

2. **Portal rendering.** My modal renders inline in the DOM tree where it's
   called. shadcn's `DialogContent` renders through `DialogPortal` into
   `document.body`, so the dialog can never get visually clipped or
   z-index-fought by an `overflow: hidden` or `position: relative` ancestor.

3. **Scroll lock.** Radix's Dialog locks background scroll while open (and
   compensates for the scrollbar-width layout shift). Mine doesn't — a user
   can still scroll the page behind the modal with a wheel or touch drag even
   though the background is inert to keyboard/AT.

4. **Outside-click dismissal and layering.** shadcn/Radix uses a
   `DismissableLayer` that correctly handles pointer-down-outside detection
   and stacks correctly if a second dialog opens on top of the first. My
   overlay `onMouseDown` closes on any outside click, which is correct for a
   single dialog but wouldn't compose safely with nested dialogs.

5. **Animation hooks.** shadcn's components expose `data-state="open"/"closed"`
   attributes specifically so Tailwind's `data-[state=...]` variants can
   animate mount/unmount. My components mount/unmount abruptly with `hidden`
   / early `return null` — functionally accessible, but with no transition
   hook.

6. **Composability.** shadcn splits each pattern into small primitives
   (`DialogTrigger`, `DialogClose`, `TabsList`, `TabsTrigger`, ...) connected
   through context, so consumers can rearrange markup and use `asChild` to
   render their own trigger element. My `Modal` and `Tabs` are single
   components with a fixed prop shape — simpler to read, but less flexible.

## Where mine matches (or is simpler and still correct)

- Both use real `<button>` elements for triggers, so Enter/Space activation
  and focus visibility come free from the browser — no reimplementation
  needed either way.
- Both correctly implement the roving-tabindex pattern for Tabs
  (`tabIndex={selected ? 0 : -1}`), and both move focus with arrow keys per
  the APG "automatic activation" model.
- Both use `aria-expanded` / `aria-controls` for the Disclosure and remove
  collapsed content from the accessibility tree with the `hidden` attribute
  rather than only hiding it visually with CSS.
- My modal's `inert` on background siblings is arguably more explicit for
  screen-reader users than Radix's approach, which relies on the portal
  target being outside `aria-hidden`'d content rather than marking siblings
  inert directly — both achieve the same practical result.

## Keyboard test notes

Manually walked through all three with keyboard only (no mouse):

- **Modal:** Tab cycles only within the dialog and wraps at both ends; Escape
  closes; focus returns to the "Open modal" button afterward.
- **Tabs:** Left/Right move and activate; Home/End jump to first/last; only
  the active tab is Tab-stoppable, and the tab panel is itself focusable so a
  screen reader user landing on it gets an announced region.
- **Disclosure:** Space/Enter on the trigger toggles content; when collapsed,
  the content is fully skipped by Tab (confirmed it's not just visually
  hidden).
