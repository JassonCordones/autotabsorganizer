import type { TabInfo } from "./tabs"
import type { GroupColor } from "../logic/colors"

export interface TabGroupPlan {
    id: string
    name: string
    color: GroupColor
    tabs: TabInfo[]
}

export interface OrganizePlan {
    groups: TabGroupPlan[]
}
