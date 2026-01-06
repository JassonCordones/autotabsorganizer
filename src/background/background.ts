//background.ts
import { generatePlan } from "./planner.js"
import { applyPlan } from "./applier.js";
type Tab = browser.tabs.Tab;

browser.runtime.onMessage.addListener(async (msg) => {
    try {
        if (msg.type === "PLAN") return await generatePlan()
        if (msg.type === "APPLY") return await applyPlan(msg.plan)
    } catch (e) {
        console.error(e)
        return { error: String(e) }
    }
})
