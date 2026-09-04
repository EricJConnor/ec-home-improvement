import Gallery, { galleryMetadata } from '../components/Gallery'

export const metadata = galleryMetadata('bathrooms')

export default function Page() {
  return <Gallery ch="bathrooms" />
}
