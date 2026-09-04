import { redirect } from 'next/navigation'
import { REVIEW_URL } from '../site'

/* ec-homes.com/review — the one link Eric gives out at the end of a walkthrough. It is short
   enough to say out loud and it survives Google changing the review URL shape: the site
   redirects, so the link on the card, in a text and on an invoice never goes stale. */
export const dynamic = 'force-static'

export function GET() {
  redirect(REVIEW_URL)
}
