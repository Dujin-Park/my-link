import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  DEFAULT_LINKS,
  DEFAULT_PROFILE,
  type LinkItem,
  type ProfileData,
} from "@/lib/dummy-data"

export interface MyLinkStep1State {
  profile: ProfileData
  links: LinkItem[]
  resetToDefault: () => void
}

export const useProfileStore = create<MyLinkStep1State>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      links: DEFAULT_LINKS,
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
