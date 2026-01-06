//aplier.ts
type Tab = browser.tabs.Tab;
import type { OrganizePlan } from "../types/plan.js"

export async function applyPlan(plan: OrganizePlan): Promise<void> {
    
    const liveTabs = await browser.tabs.query({ currentWindow: true })
    const liveTabIds = new Set(liveTabs.map((t:Tab) => t.id).filter(Boolean))

    for (const group of plan.groups) {
        const tabIds = group.tabs
            .map(t => t.id)
            .filter(id => liveTabIds.has(id))

        // Skip empty or invalid groups
        if (tabIds.length < 2) continue

        const groupId = await browser.tabs.group({ tabIds })

        await browser.tabGroups.update(groupId, {
            title: group.name,
            color: group.color
        })
    }
}
