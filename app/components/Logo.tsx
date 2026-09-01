/* A mark built from the site's own language rather than dropped on top of it: the whole
   layout is hairline rules, so the logo is one too — an open frame with a plumb line
   hanging from the top rail.
   The plumb bob is the oldest tool on a job site and it means true, level, upright; it
   also reads as the pendant in Eric's original mark.

   The stroke is heavier than a rule anywhere else on the site, and that is the point: at
   1.5 against a 600-weight EC the frame read as scaffolding behind the name rather than a
   mark standing beside it. A drawn line needs more weight than a filled letterform to
   carry the same presence. */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg className={`logo ${className}`} viewBox="0 0 40 44" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        {/* the frame is deliberately open — a room you can walk into, not a box */}
        <path d="M4 6 H36" />
        <path d="M4 6 V38" />
        <path d="M4 38 H13" />
        <path d="M36 6 V19" />
        <path d="M15.5 6 V27.3" />
      </g>
      {/* the bob carries the weight — it is the one solid thing in the mark */}
      <circle cx="15.5" cy="30" r="2.9" fill="currentColor" />
    </svg>
  )
}
