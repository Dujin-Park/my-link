import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  DEFAULT_LINKS,
  DEFAULT_PROFILE,
  type IconName,
  type LinkItem,
} from "@/lib/dummy-data"
import type { NewLinkInput } from "@/lib/store"

const DEFAULT_LINK_IDS = new Set(DEFAULT_LINKS.map((item) => item.id))

export interface UserProfileDoc {
  uid: string
  username?: string
  displayName?: string
  bio?: string
  avatarUrl?: string
  email?: string
}

export async function ensureUserDocument(user: {
  uid: string
  displayName?: string | null
  email?: string | null
  photoURL?: string | null
}): Promise<UserProfileDoc> {
  const userDocRef = doc(db, "users", user.uid)
  const docSnap = await getDoc(userDocRef)

  const emailPrefix = user.email ? user.email.split("@")[0] : undefined
  const defaultUsername = emailPrefix || user.uid
  const defaultDisplayName =
    user.displayName || emailPrefix || DEFAULT_PROFILE.name

  if (!docSnap.exists()) {
    const initialDoc = {
      uid: user.uid,
      username: defaultUsername,
      displayName: defaultDisplayName,
      bio: DEFAULT_PROFILE.bio,
      avatarUrl: user.photoURL || DEFAULT_PROFILE.avatarUrl,
      email: user.email || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    await setDoc(userDocRef, initialDoc, { merge: true })
    return {
      uid: user.uid,
      username: defaultUsername,
      displayName: defaultDisplayName,
      bio: DEFAULT_PROFILE.bio,
      avatarUrl: user.photoURL || DEFAULT_PROFILE.avatarUrl,
      email: user.email || "",
    }
  }

  const data = docSnap.data()
  const updates: Record<string, unknown> = {}

  if (!data.uid) updates.uid = user.uid
  if ((!data.username || data.username === user.uid) && defaultUsername) {
    updates.username = defaultUsername
  }
  if (!data.displayName && defaultDisplayName)
    updates.displayName = defaultDisplayName
  if (data.bio === undefined) updates.bio = DEFAULT_PROFILE.bio
  if (!data.avatarUrl && user.photoURL) updates.avatarUrl = user.photoURL

  if (Object.keys(updates).length > 0) {
    await setDoc(
      userDocRef,
      { ...updates, updatedAt: serverTimestamp() },
      { merge: true }
    )
  }

  return {
    uid: user.uid,
    username:
      typeof data.username === "string" && data.username !== user.uid
        ? data.username
        : defaultUsername,
    displayName:
      typeof data.displayName === "string"
        ? data.displayName
        : defaultDisplayName,
    bio: typeof data.bio === "string" ? data.bio : DEFAULT_PROFILE.bio,
    avatarUrl:
      typeof data.avatarUrl === "string"
        ? data.avatarUrl
        : user.photoURL || DEFAULT_PROFILE.avatarUrl,
    email: typeof data.email === "string" ? data.email : user.email || "",
  }
}

export async function fetchUserProfile(
  userId: string
): Promise<UserProfileDoc | null> {
  const userDocRef = doc(db, "users", userId)
  const docSnap = await getDoc(userDocRef)
  if (!docSnap.exists()) {
    return null
  }
  const data = docSnap.data()
  return {
    uid: docSnap.id,
    username: typeof data.username === "string" ? data.username : undefined,
    displayName:
      typeof data.displayName === "string" ? data.displayName : undefined,
    bio: typeof data.bio === "string" ? data.bio : undefined,
    avatarUrl: typeof data.avatarUrl === "string" ? data.avatarUrl : undefined,
    email: typeof data.email === "string" ? data.email : undefined,
  }
}

export async function resolveUserByIdentifier(
  rawIdentifier: string
): Promise<{
  userId: string
  profile: UserProfileDoc
  links: LinkItem[]
} | null> {
  const identifier = decodeURIComponent(rawIdentifier).trim()
  if (!identifier) return null

  const usersRef = collection(db, "users")
  let resolvedUserId: string | null = null
  let resolvedProfile: UserProfileDoc | null = null

  // 1) users/{identifier} 문서 직접 조회 (UID로 접근한 경우)
  const directDocSnap = await getDoc(doc(db, "users", identifier))
  if (directDocSnap.exists()) {
    const data = directDocSnap.data()
    resolvedUserId = directDocSnap.id
    resolvedProfile = {
      uid: directDocSnap.id,
      username: typeof data.username === "string" ? data.username : undefined,
      displayName:
        typeof data.displayName === "string" ? data.displayName : undefined,
      bio: typeof data.bio === "string" ? data.bio : undefined,
      avatarUrl:
        typeof data.avatarUrl === "string" ? data.avatarUrl : undefined,
      email: typeof data.email === "string" ? data.email : undefined,
    }
  }

  // 2) username 필드로 조회
  if (!resolvedUserId) {
    const usernameQuery = query(
      usersRef,
      where("username", "==", identifier),
      limit(1)
    )
    const usernameSnap = await getDocs(usernameQuery)
    if (!usernameSnap.empty) {
      const docSnap = usernameSnap.docs[0]
      const data = docSnap.data()
      resolvedUserId = docSnap.id
      resolvedProfile = {
        uid: docSnap.id,
        username: typeof data.username === "string" ? data.username : undefined,
        displayName:
          typeof data.displayName === "string" ? data.displayName : undefined,
        bio: typeof data.bio === "string" ? data.bio : undefined,
        avatarUrl:
          typeof data.avatarUrl === "string" ? data.avatarUrl : undefined,
        email: typeof data.email === "string" ? data.email : undefined,
      }
    }
  }

  // 3) displayName 필드로 조회
  if (!resolvedUserId) {
    const displayNameQuery = query(
      usersRef,
      where("displayName", "==", identifier),
      limit(1)
    )
    const displayNameSnap = await getDocs(displayNameQuery)
    if (!displayNameSnap.empty) {
      const docSnap = displayNameSnap.docs[0]
      const data = docSnap.data()
      resolvedUserId = docSnap.id
      resolvedProfile = {
        uid: docSnap.id,
        username: typeof data.username === "string" ? data.username : undefined,
        displayName:
          typeof data.displayName === "string" ? data.displayName : undefined,
        bio: typeof data.bio === "string" ? data.bio : undefined,
        avatarUrl:
          typeof data.avatarUrl === "string" ? data.avatarUrl : undefined,
        email: typeof data.email === "string" ? data.email : undefined,
      }
    }
  }

  // 4) 만약 users/{identifier} 상위 문서 없이 users/{identifier}/links 하위 컬렉션만 존재하는 경우 확인
  if (!resolvedUserId) {
    const subLinksSnap = await getDocs(
      query(collection(db, "users", identifier, "links"), limit(1))
    )
    if (!subLinksSnap.empty) {
      resolvedUserId = identifier
      resolvedProfile = {
        uid: identifier,
        displayName: DEFAULT_PROFILE.name,
        bio: DEFAULT_PROFILE.bio,
        avatarUrl: DEFAULT_PROFILE.avatarUrl,
      }
    }
  }

  if (!resolvedUserId || !resolvedProfile) {
    return null
  }

  const firestoreLinks = await fetchFirestoreLinks(resolvedUserId)

  return {
    userId: resolvedUserId,
    profile: resolvedProfile,
    links: firestoreLinks,
  }
}

export async function updateUserProfile(
  userId: string,
  updates: { displayName?: string; bio?: string; username?: string }
): Promise<void> {
  const userDocRef = doc(db, "users", userId)
  await setDoc(
    userDocRef,
    {
      ...updates,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

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
    clickCount: typeof data.clickCount === "number" ? data.clickCount : 0,
  }
}

export async function fetchFirestoreLinks(userId: string): Promise<LinkItem[]> {
  const q = query(
    collection(db, "users", userId, "links"),
    orderBy("createdAt", "desc")
  )
  const querySnapshot = await getDocs(q)
  // 기존에 자동 생성되었을 수 있는 기본 더미 링크 ID(link-github 등)는 제외하고 사용자가 직접 추가한 링크만 반환
  return querySnapshot.docs
    .filter((docSnap) => !DEFAULT_LINK_IDS.has(docSnap.id))
    .map(mapDocToLinkItem)
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
    clickCount: 0,
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
    clickCount: 0,
  }
}

export async function incrementClickCount(
  userId: string,
  linkId: string
): Promise<void> {
  if (!userId) {
    console.error("클릭 카운트 저장 실패: 사용자 정보(userId)가 없습니다.")
    return
  }

  try {
    const linkDocRef = doc(db, "users", userId, "links", linkId)
    await updateDoc(linkDocRef, {
      clickCount: increment(1),
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("링크 클릭 카운트 저장 실패:", error)
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
