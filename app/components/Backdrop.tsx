/* The colour field behind the page: Eric's own FlexMarble walls, blurred past
   recognition. The two travelling highlights are the part you can actually see move —
   a blurred wash has no edges to track, so motion inside it reads as nothing at all.
   `quiet` dials it back on the landing, where the footage and photographs already
   carry the colour. */
export default function Backdrop({ quiet = false }: { quiet?: boolean }) {
  return (
    <div className={`bg${quiet ? ' bg-quiet' : ''}`} aria-hidden="true">
      <div className="bg-inner">
        <img src="/full/p4085.jpg" alt="" />
      </div>
      <div className="bg-2">
        <img src="/full/p4082.jpg" alt="" />
      </div>
      <div className="bg-sweep" />
      <div className="bg-sweep bg-sweep-2" />
      <div className="bg-grain" />
    </div>
  )
}
