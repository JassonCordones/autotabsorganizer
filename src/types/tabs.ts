import type { GroupColor } from "../logic/colors"
export interface TabInfo {
    id: number
    title: string
    url: string
}

export interface TabGroupPlan {
    id: string               // deterministic hash
    name: string
    color: GroupColor
    tabs: TabInfo[]
}