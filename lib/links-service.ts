import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { IconName, LinkItem } from "@/lib/dummy-data"
import type { NewLinkInput } from "@/lib/store"

const ANONYMOUS_LINKS_PATH = ["users", "anonymous", "links"] as const

export async function createFirestoreLink(input: NewLinkInput): Promise<string> {
  const linksCollectionRef = collection(db, ...ANONYMOUS_LINKS_PATH)
  const docRef = await addDoc(linksCollectionRef, {
    title: input.title.trim(),
    url: input.url.trim(),
    subtitle: input.subtitle.trim() || "클릭하면 해당 채널로 이동해요",
    meta: input.meta.trim() || "링크",
    icon: input.icon,
    enabled: true,
    isHighlight: Boolean(input.isHighlight),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export function subscribeFirestoreLinks(
  onUpdate: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const linksCollectionRef = collection(db, ...ANONYMOUS_LINKS_PATH)
  const q = query(linksCollectionRef, orderBy("createdAt", "asc"))

  return onSnapshot(
    q,
    (snapshot) => {
      const firestoreLinks: LinkItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          title: typeof data.title === "string" ? data.title : "",
          url: typeof data.url === "string" ? data.url : "",
          subtitle:
            typeof data.subtitle === "string" && data.subtitle
              ? data.subtitle
              : "클릭하면 해당 채널로 이동해요",
          meta:
            typeof data.meta === "string" && data.meta ? data.meta : "링크",
          icon: (data.icon as IconName) || "globe",
          enabled: typeof data.enabled === "boolean" ? data.enabled : true,
          isHighlight: Boolean(data.isHighlight),
        }
      })
      onUpdate(firestoreLinks)
    },
    (error) => {
      onError?.(error)
    }
  )
}
