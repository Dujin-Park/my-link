export default function Home() {
  return (
    <main
      suppressHydrationWarning
      className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-12 dark:bg-zinc-950"
    >
      <div
        suppressHydrationWarning
        className="flex w-full max-w-md flex-col items-center rounded-3xl border border-zinc-200/80 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        {/* 프로필 아바타 */}
        <div
          suppressHydrationWarning
          className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-3xl font-bold text-white shadow-md"
        >
          박
        </div>

        {/* 이름 */}
        <h1
          suppressHydrationWarning
          className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          박두진
        </h1>

        {/* 소개글 */}
        <p
          suppressHydrationWarning
          className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400"
        >
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
        </p>
      </div>
    </main>
  );
}
