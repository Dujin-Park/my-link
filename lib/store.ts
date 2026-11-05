import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  DEFAULT_LINKS,
  DEFAULT_PROFILE,
  type IconName,
  type LinkItem,
  type ProfileData,
} from "@/lib/dummy-data"

export interface NewLinkInput {
  title: string
  subtitle: string
  meta: string
  url: string
  icon: IconName
  isHighlight?: boolean
}

export interface MyLinkStep1State {
  profile: ProfileData
  links: LinkItem[]
  addLink: (input: NewLinkInput) => void
  resetToDefault: () => void
}

export const useProfileStore = create<MyLinkStep1State>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      links: DEFAULT_LINKS,
      addLink: (input) =>
        set((state) => ({
          links: [
            ...state.links,
            {
              id: `link-${Date.now()}`,
              title: input.title.trim(),
              subtitle: input.subtitle.trim() || "클릭하면 해당 채널로 이동해요",
              meta: input.meta.trim() || "링크",
              url: input.url.trim(),
              icon: input.icon,
              enabled: true,
              isHighlight: Boolean(input.isHighlight),
              clickCount: 0,
            },
          ],
        })),
      resetToDefault: () =>
        set({
          profile: DEFAULT_PROFILE,
          links: DEFAULT_LINKS,
        }),
    }),
    {
      name: "mylink_profile_v1",
    }
  )
)
