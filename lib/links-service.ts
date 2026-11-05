import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { IconName, LinkItem } from "@/lib/dummy-data"
import type { NewLinkInput } from "@/lib/store"

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

export async function fetchFirestoreLinks(userId: string): Promise<LinkItem[]> {
  const q = query(
    collection(db, "users", userId, "links"),
    orderBy("createdAt", "desc")
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(mapDocToLinkItem)
}

export async function createFirestoreLink(
  userId: string,
  input: NewLinkInput
): Promise<LinkItem> {
  const linksCollectionRef = collection(db, "users", userId, "links")
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

export async function updateFirestoreLink(
  userId: string,
  id: string,
  updates: { title: string; url: string }
): Promise<void> {
  const linkDocRef = doc(db, "users", userId, "links", id)
  await updateDoc(linkDocRef, {
    title: updates.title.trim(),
    url: updates.url.trim(),
    updatedAt: serverTimestamp(),
  })
}

export async function deleteFirestoreLink(
  userId: string,
  id: string
): Promise<void> {
  const linkDocRef = doc(db, "users", userId, "links", id)
  await deleteDoc(linkDocRef)
}
