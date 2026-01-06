import type { OrganizePlan } from "../types/plan.js"

const planBtn = document.getElementById("plan")!
const preview = document.getElementById("preview")!
const status = document.getElementById("status")!
const actions = document.getElementById("actions")!
const acceptBtn = document.getElementById("accept")!
const cancelBtn = document.getElementById("cancel")!

let currentPlan: OrganizePlan | null = null

planBtn.addEventListener("click", async () => {
    planBtn.setAttribute("disabled", "true")
    showStatus("Analyzing tabs…")

    try {
        const plan = await browser.runtime.sendMessage({ type: "PLAN" })
        currentPlan = plan

        renderPreview(plan)
        showActions()
    } catch (e) {
        showStatus("Failed to generate plan.")
        planBtn.removeAttribute("disabled")
    }
})

acceptBtn.addEventListener("click", async () => {
    if (!currentPlan) return

    await browser.runtime.sendMessage({
        type: "APPLY",
        plan: currentPlan
    })

    window.close()
})

cancelBtn.addEventListener("click", () => {
    currentPlan = null
    preview.innerHTML = ""
    hideActions()
    showStatus("Canceled.")
    planBtn.removeAttribute("disabled")
})

/* ─────────────────────────────── */

function showStatus(text: string) {
    status.textContent = text
    status.classList.remove("hidden")
    preview.classList.add("hidden")
}

function showActions() {
    status.classList.add("hidden")
    preview.classList.remove("hidden")
    actions.classList.remove("hidden")
}

function hideActions() {
    actions.classList.add("hidden")
    preview.classList.add("hidden")
}

function renderPreview(plan: OrganizePlan) {
    preview.innerHTML = ""

    if (plan.groups.length === 0) {
        showStatus("No meaningful groups found.")
        return
    }

    for (const group of plan.groups) {
        const container = document.createElement("div")
        container.className = "group"
        container.style.setProperty("--color", group.color)

        const header = document.createElement("div")
        header.className = "group-header"

        const title = document.createElement("div")
        title.className = "group-title"
        title.textContent = group.name

        const count = document.createElement("div")
        count.className = "group-count"
        count.textContent = `${group.tabs.length} tabs`

        header.append(title, count)
        container.appendChild(header)

        for (const tab of group.tabs) {
            const t = document.createElement("div")
            t.className = "tab"
            t.textContent = tab.title || tab.url
            container.appendChild(t)
        }

        preview.appendChild(container)
    }
}
