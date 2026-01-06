import type { TabInfo } from "../types/tabs"

export function generateGroupName(tabs: TabInfo[]): string {
  if (tabs.length === 0) return "Empty"

  const domains = tabs.map(t => {
    try {
      return new URL(t.url).hostname.replace(/^www\./, "")
    } catch {
      return ""
    }
  })

  const freq = new Map<string, number>()
  for (const d of domains) {
    if (!d) continue
    freq.set(d, (freq.get(d) ?? 0) + 1)
  }

  const [top] = [...freq.entries()].sort((a, b) => b[1] - a[1])
  if (top) return humanize(top[0])

  return "Misc"
}

function humanize(domain: string): string {
  return (domain.split(".")[0]??"").replace(/[-_]/g, " ").toUpperCase()
}
