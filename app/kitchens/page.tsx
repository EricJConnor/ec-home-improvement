import Gallery, { galleryMetadata } from '../components/Gallery'

export const metadata = galleryMetadata('kitchens')

export default function Page() {
  return <Gallery ch="kitchens" />
}
