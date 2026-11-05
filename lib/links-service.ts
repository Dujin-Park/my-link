import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { IconName, LinkItem } from "@/lib/dummy-data"
import type { NewLinkInput } from "@/lib/store"

const ANONYMOUS_LINKS_PATH = ["users", "anonymous", "links"] as const

function mapDocToLinkItem(docSnap: QueryDocumentSnapshot): LinkItem {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    title: typeof data.title === "string" ? data.title : "",
    url: typeof data.url === "string" ? data.url : "",
    subtitle:
      typeof data.subtitle === "string" && data.subtitle
        ? data.subtitle
        : "클릭하면 해당 채널로 이동해요",
    meta: typeof data.meta === "string" && data.meta ? data.meta : "링크",
    icon: (data.icon as IconName) || "globe",
    enabled: typeof data.enabled === "boolean" ? data.enabled : true,
    isHighlight: Boolean(data.isHighlight),
  }
}

export async function fetchFirestoreLinks(): Promise<LinkItem[]> {
  const q = query(
    collection(db, "users", "anonymous", "links"),
    orderBy("createdAt", "desc")
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(mapDocToLinkItem)
}

export async function createFirestoreLink(
  input: NewLinkInput
): Promise<LinkItem> {
  const linksCollectionRef = collection(db, ...ANONYMOUS_LINKS_PATH)
  const trimmedTitle = input.title.trim()
  const trimmedUrl = input.url.trim()
  const trimmedSubtitle =
    input.subtitle.trim() || "클릭하면 해당 채널로 이동해요"
  const trimmedMeta = input.meta.trim() || "링크"
  const isHighlight = Boolean(input.isHighlight)

  const docRef = await addDoc(linksCollectionRef, {
    title: trimmedTitle,
    url: trimmedUrl,
    subtitle: trimmedSubtitle,
    meta: trimmedMeta,
    icon: input.icon,
    enabled: true,
    isHighlight,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
    title: trimmedTitle,
    url: trimmedUrl,
    subtitle: trimmedSubtitle,
    meta: trimmedMeta,
    icon: input.icon,
    enabled: true,
    isHighlight,
  }
}
