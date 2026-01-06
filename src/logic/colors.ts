export const COLORS = [
    "blue", "red", "green", "yellow",
    "purple", "cyan", "orange", "pink",
] as const

export type GroupColor = typeof COLORS[number]

export function pickColor(seed: string): GroupColor {
    const i = hash(seed) % COLORS.length;
    const color = COLORS[i]
    if (!color) throw new Error("Invariant violated: COLORS empty")
    return color
}

function hash(str: string): number {
    let h = 0
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i)
        h |= 0
    }
    return Math.abs(h)
}
