import Gallery, { galleryMetadata } from '../components/Gallery'

export const metadata = galleryMetadata('painting')

export default function Page() {
  return <Gallery ch="painting" />
}
