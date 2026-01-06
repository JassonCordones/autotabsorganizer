//planner.ts
import { embed } from "../ml/embedder.js"
import { kMeans } from "../ml/cluster.js"
import { generateGroupName } from "../logic/naming.js"
import { pickColor } from "../logic/colors.js"

import type { OrganizePlan, TabGroupPlan } from "../types/plan.js"
import type { TabInfo } from "../types/tabs.js"

export async function generatePlan(): Promise<OrganizePlan> {
    const tabs = await collectCandidateTabs()

    if (tabs.length < 2) {
        return { groups: [] }
    }

    const embeddings = await embed(tabs.map(t => `${t.title} ${t.url}`))
    const k = Math.max(2, Math.round(Math.sqrt(embeddings.length)))
    const labels = kMeans(embeddings, k)
    const clusters: TabInfo[][] = Array.from({ length: k }, () => [] )

    tabs.forEach((tab, i) => {
        clusters[labels[i]!]!.push(tab)
    })

    const groups: TabGroupPlan[] = clusters.map(clusterTabs => {
        // const clusterTabs: TabInfo[] = cluster.map((i:number)=> tabs[i])

        const name = generateGroupName(clusterTabs)
        const color = pickColor(name)
        console.log("name:", name)
        console.log("color:", color)
        return {
            id: stableGroupId(clusterTabs),
            name,
            color,
            tabs: clusterTabs
        }
    })

    return {
        groups: normalizeGroups(groups)
    }
}

async function collectCandidateTabs(): Promise<TabInfo[]> {
    const tabs = await browser.tabs.query({
        currentWindow: true
    })

    return tabs
        .filter(t =>
            t.id !== undefined &&
            !t.pinned &&
            !t.audible &&
            t.url &&
            isOrganizableUrl(t.url)
        )
        .map(t => ({
            id: t.id!,
            title: t.title ?? "",
            url: t.url!
        }))
}


// Deterministic ID so preview ↔ apply stays consistent
function stableGroupId(tabs: TabInfo[]): string {
    const seed = tabs
        .map(t => t.url)
        .sort()
        .join("|")

    return hash(seed)
}

// Avoid empty / singleton / garbage groups
function normalizeGroups(groups: TabGroupPlan[]): TabGroupPlan[] {
    return groups
        .filter(g => g.tabs.length > 1)
        .sort((a, b) => b.tabs.length - a.tabs.length)
}

// Skip about:, moz-extension:, file:, etc.
function isOrganizableUrl(url: string): boolean {
    try {
        const u = new URL(url)
        return u.protocol === "http:" || u.protocol === "https:"
    } catch {
        return false
    }
}

// Simple fast hash (stable, non-crypto)
function hash(input: string): string {
    let h = 2166136261
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i)
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
    }
    return (h >>> 0).toString(36)
}
