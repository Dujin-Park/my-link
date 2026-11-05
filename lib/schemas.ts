import { z } from "zod"

function isValidHttpUrl(value: string): boolean {
  const trimmed = value.trim()
  if (!/^https?:\/\/.+/i.test(trimmed)) {
    return false
  }
  try {
    const parsed = new URL(trimmed)
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      Boolean(parsed.hostname) &&
      parsed.hostname.includes(".")
    )
  } catch {
    return false
  }
}

export const linkFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "제목을 입력해주세요" }),
  url: z
    .string()
    .trim()
    .refine(isValidHttpUrl, {
      message: "올바른 URL 형식이 아닙니다. 예: https://example.com",
    }),
})

export type LinkFormValues = z.infer<typeof linkFormSchema>

export function validateLinkForm(values: { title: string; url: string }): {
  success: boolean
  titleError: string
  urlError: string
} {
  const result = linkFormSchema.safeParse(values)
  if (result.success) {
    return {
      success: true,
      titleError: "",
      urlError: "",
    }
  }

  let titleError = ""
  let urlError = ""

  for (const issue of result.error.issues) {
    if (issue.path[0] === "title" && !titleError) {
      titleError = issue.message
    }
    if (issue.path[0] === "url" && !urlError) {
      urlError = issue.message
    }
  }

  return {
    success: false,
    titleError,
    urlError,
  }
}
