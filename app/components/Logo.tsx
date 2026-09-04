/* The mark, redrawn (Sep 2026) so it reads as the name first: EC in the display face under
   the frame's top rail, with the plumb line hanging off the rail's end beside the C. It was
   an open frame with a plumb inside it, and at the 40px Google shows a logo that read as a
   box with a line in it. Eric picked this one from three at that size.

   The letters are real text so they set in the same Bricolage as everything else and
   inherit currentColor, which is what lets the header's difference blend work on them.
   The rail is drawn a touch heavier than a rule elsewhere: a line needs more weight than a
   letterform to carry the same presence. Keep viewBox and font-size together — the rail's
   end and the plumb are placed against the width the letters actually set at. */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg className={`logo ${className}`} viewBox="0 0 56 48" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="square">
        <path d="M1 2 H52" />
        <path d="M52 2 V16" />
      </g>
      <circle cx="52" cy="19.4" r="3.1" fill="currentColor" />
      <text x="0" y="46.5" fontSize="38" fontWeight="300" letterSpacing="-1.7" fill="currentColor">EC</text>
    </svg>
  )
}
