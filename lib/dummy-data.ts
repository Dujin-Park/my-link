export type IconName =
  | "github"
  | "folder"
  | "book"
  | "mail"
  | "globe";

export interface LinkItem {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  url: string;
  icon: IconName;
  enabled: boolean;
  isHighlight?: boolean;
}

export interface ProfileData {
  name: string;
  badge: string;
  bio: string;
  avatarUrl: string;
  chips: { name: string; active: boolean }[];
}

export const DEFAULT_PROFILE: ProfileData = {
  name: "박두진",
  badge: "프론트엔드 개발자",
  bio: "사용자의 시간을 아껴주는 깔끔한 웹을 만들어요.\nNext.js와 TypeScript로 복잡한 문제를 쉽게 풀고 있어요.",
  avatarUrl: "/profile-avatar.svg",
  chips: [
    { name: "Next.js", active: true },
    { name: "TypeScript", active: false },
    { name: "React", active: false },
    { name: "Tailwind CSS", active: false },
    { name: "Git · GitHub", active: false },
  ],
};

export const DEFAULT_LINKS: LinkItem[] = [
  {
    id: "link-github",
    title: "GitHub 저장소",
    subtitle: "작성한 코드와 오픈소스 활동을 볼 수 있어요",
    meta: "@Dujin-Park",
    url: "https://github.com/Dujin-Park",
    icon: "github",
    enabled: true,
    isHighlight: true,
  },
  {
    id: "link-projects",
    title: "만든 프로젝트",
    subtitle: "직접 기획하고 구현한 웹 서비스를 모았어요",
    meta: "2개",
    url: "https://github.com/Dujin-Park?tab=repositories",
    icon: "folder",
    enabled: true,
    isHighlight: false,
  },
  {
    id: "link-blog",
    title: "개발 노트",
    subtitle: "문제를 해결하고 배운 과정을 기록해요",
    meta: "블로그",
    url: "https://github.com/Dujin-Park",
    icon: "book",
    enabled: true,
    isHighlight: false,
  },
  {
    id: "link-portfolio",
    title: "개인 웹사이트",
    subtitle: "프론트엔드 작업물과 기술 아티클을 소개해요",
    meta: "웹사이트",
    url: "https://github.com/Dujin-Park/my-link",
    icon: "globe",
    enabled: true,
    isHighlight: false,
  },
  {
    id: "link-email",
    title: "이메일 보내기",
    subtitle: "협업이나 가벼운 커피챗 모두 환영해요",
    meta: "문의",
    url: "mailto:337679249+Dujin-Park@users.noreply.github.com",
    icon: "mail",
    enabled: true,
    isHighlight: false,
  },
];
