/* eslint-disable @next/next/no-img-element */
"use client"

import { cn } from "@/lib/utils"
import { Marquee } from "@/registry/magicui/marquee"

const reviews = [
 {
    name: "Aryan Penukonda",
    body: "The work is really smooth. The service is really great.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Sachin",
    body: "Websites are really smooth and the interaction with the team was reassuring.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "Amaan",
    body: "Team at Florix is very friendly and very compassionate to work with. Had great compatibility",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Ankita",
    body: "The work was very pinpoint to the requirements. They also picth in with suggestions.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Manikanta",
    body: "Great work. Quick responses.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "Akshay",
    body: "Follows timelines properly and reasonable prices for the services.",
    img: "https://avatar.vercel.sh/james",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">{name}</figcaption>
          {/* <p className="text-xs font-medium dark:text-white/40">{username}</p> */}
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-7 py-6 overflow-hidden">


      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  )
}

export const Marquee3D = MarqueeDemo

export default MarqueeDemo
