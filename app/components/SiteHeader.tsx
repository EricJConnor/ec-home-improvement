/* Shared between the landing and the gallery. `base` prefixes the in-page anchors so
   the gallery's nav points back at the landing's sections rather than nowhere. */
export default function SiteHeader({ base = '' }: { base?: string }) {
  const nav = [
    ['kitchens', 'Kitchens'], ['bathrooms', 'Bathrooms'], ['flexmarble', 'Statement Walls'],
    ['outdoors', 'Outdoors'], ['painting', 'Painting'], ['how', 'How we work'],
    ['agents', 'Agents'], ['contact', 'Contact'],
  ]
  return (
    <>
      <header className="hdr">
        <a className="mark" href={base || '#top'} aria-label="EC Home Improvement, home">
          EC<span>Home Improvement</span>
        </a>
        <nav className="nav" aria-label="Primary">
          {nav.map(([id, label]) => (
            <a key={id} href={`${base}#${id}`}>{label}</a>
          ))}
          <a href="/gallery">Gallery</a>
        </nav>
        <button className="burger" aria-expanded="false" aria-controls="sheet">Menu</button>
      </header>
      <div className="sheet" id="sheet">
        <button aria-label="Close menu">Close</button>
        {nav.filter(([id]) => id !== 'how').map(([id, label]) => (
          <a key={id} href={`${base}#${id}`}>{label}</a>
        ))}
        <a href="/gallery">Gallery</a>
      </div>
    </>
  )
}
