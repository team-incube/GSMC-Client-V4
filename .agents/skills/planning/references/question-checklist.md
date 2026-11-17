# Question checklist

Questions this project's features usually leave unanswered. Skip any the user or the codebase already settled.

## Scope

- Which app: `client`, `admin`, or both? If both, what is shared and what differs?
- What is explicitly out of scope for this round?
- Is there a Figma design? Which frames?

## Placement

- Which FSD layer and slice? (`views` for a page, `features` for a reusable action, `entities` for domain data)
- Does it need a new `@repo/ui` component, or can existing ones be extended?
- Does it need a new route? Inside which route group?

## Data

- Does the API exist yet? If not, what mock shape do we build against, and who owns the contract?
- What does the API return when empty, on error, and for unauthorized users?
- Does the data change while the page is open? How fresh must it be (`staleTime`)?
- After a mutation, what should refresh?

## UI states

- Loading, empty, and error states: what does each look like?
- Mobile layout: what changes below `md`?
- Dark mode: any images or colors that tokens do not cover?
- Long text, many items, zero items: how should each behave?

## Behavior

- Who can see or use this? What happens for users without permission?
- What happens on refresh, back navigation, or a shared link (state in URL or not)?
- Any accessibility requirements beyond the defaults (keyboard flows, focus handling)?
