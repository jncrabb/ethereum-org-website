import { StaticImageData } from "next/image"

import type {
  CrowdinContributor,
  Frontmatter,
  Lang,
  Layout,
  ToCItem,
  TranslationKey,
} from "@/lib/types"

export interface DeveloperDocsLink {
  id: TranslationKey
  to: string
  path: string
  description: TranslationKey
  items: DeveloperDocsLink[]
}

/**
 * Layout interface
 */
export interface SharedFrontmatter {
  title: string
  description: string
  lang: Lang
  sidebarDepth?: number
  isOutdated?: boolean
  template?: Layout
}

export interface StaticFrontmatter extends SharedFrontmatter {
  hideEditButton?: boolean
}

/**
 * TODO: Refactor markdown content that currently uses SummaryPointsNumbered
 * to use SummaryPoints (`summaryPoints: string[]`) instead. Then
 * deprecate @/lib/util/getSummaryPoints.ts
 */
export interface SummaryPointsNumbered {
  summaryPoint1?: string
  summaryPoint2?: string
  summaryPoint3?: string
  summaryPoint4?: string
}

interface SummaryPoints {
  summaryPoints: string[]
}

interface ImageInfo {
  image: string
  alt: string
  blurDataURL: string
}

export interface UpgradeFrontmatter
  extends SharedFrontmatter,
    SummaryPointsNumbered,
    ImageInfo {}

export interface RoadmapFrontmatter extends SharedFrontmatter, ImageInfo {
  buttons: {
    label: string
    toId?: string
    to?: string
    variant?: string
  }[]
}

export interface UseCasesFrontmatter
  extends SharedFrontmatter,
    SummaryPointsNumbered,
    ImageInfo {
  emoji: string
}

export interface StakingFrontmatter
  extends SharedFrontmatter,
    SummaryPoints,
    ImageInfo {
  emoji: string
}

export interface DocsFrontmatter extends SharedFrontmatter {
  incomplete?: boolean
  hideEditButton?: boolean
}

export interface TutorialFrontmatter extends SharedFrontmatter {
  tags: string[]
  author: string
  source?: string
  sourceUrl?: string
  skill: string
  published: string
  address?: string
  hideEditButton?: boolean
}

export interface MdPageContent {
  slug: string
  content: string
  frontmatter: Frontmatter
  tocItems: ToCItem[]
  lastUpdatedDate?: string
  contentNotTranslated: boolean
  crowdinContributors: CrowdinContributor[]
}

// Local environment framework
export interface Framework {
  id: string
  url: string
  githubUrl: string
  background: string
  name: string
  description: string
  alt: string
  image: StaticImageData
  starCount?: number
  languages?: string[]
}

/**
 * Community events
 */

export interface CommunityEventsReturnType {
  pastEventData: CommunityEvent[]
  upcomingEventData: CommunityEvent[]
}

export interface CommunityEvent {
  date: string
  title: string
  calendarLink: string
}

export interface ReqCommunityEvent {
  start: { dateTime: string }
  summary: string
  htmlLink: string
  location: string
}

/**
 * Community page
 */

export interface ICard {
  image: StaticImageData
  title: string
  description: string
  alt: string
  to: string
}

export interface IGetInvolvedCard {
  emoji: string
  title: string
  description: string
}
