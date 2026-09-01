# Vendored skills

The skill directories here are **Emil Kowalski's**, taken unmodified from
<https://github.com/emilkowalski/skills> at commit `d23d7f8`, MIT licensed —
see `LICENSE-emilkowalski`. Eric asked for them on this project.

Do not edit them in place. To update:

    git clone --depth 1 https://github.com/emilkowalski/skills /tmp/eks
    cp -R /tmp/eks/skills/<name> .claude/skills/

## What is here, and why these

| Skill | Use it for |
|---|---|
| `animate` | Building a new motion moment from scratch — the decision order that makes it feel right. |
| `review-animations` | Critiquing motion in a diff against a high craft bar. Manual invoke. |
| `improve-animations` | Auditing all the motion on the site and planning fixes. |
| `find-animation-opportunities` | Finding places that should move and rejecting the ones that shouldn't. |
| `animation-vocabulary` | Turning "the bouncy thing when it opens" into the actual term. |
| `apple-design` | Gesture-driven UI, springs, interruptible transitions, depth, optical sizing. |
| `emil-design-eng` | The general philosophy on polish and the invisible details. |
| `prototype` | Several genuinely different versions behind a picker, to flip through. Manual invoke. |

Deliberately **not** vendored:

- `animate-expo`, `write-swift` — React Native and Swift. Nothing here is native.
- `ask-sonner`, `pick-ui-library` — both are about pulling in UI libraries, and the
  brief locks this site to plain CSS with no UI libraries and no Tailwind. Ask if that
  ever changes.

## Where these disagree with the brief, the brief wins

These skills assume React component work with Motion/Framer Motion and Tailwind in
reach. This site is plain CSS, hand-written keyframes and transitions, and one
orchestrated motion moment per page. Take the **judgment** — easing direction, duration
ceilings, interruptibility, transform/opacity only, reduced-motion — and leave the
tooling. Do not let a skill talk you into adding a dependency.
