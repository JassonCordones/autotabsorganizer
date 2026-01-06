// TODO: replace with TF.js / ONNX later
const DIM = 256 // final dimension
const PROJ_DIM = 512     // intermediate (lower collision)
const NGRAMS = [3, 4, 5] as const

// fixed random projection (Achlioptas)
const proj = getProjection(PROJ_DIM, DIM)

export async function embed(texts: string[]): Promise<number[][]> {

    return texts.map(text => {
        const v = new Float32Array(PROJ_DIM)
        const s = text.toLowerCase()

        for (const n of NGRAMS) {
            for (let i = 0; i <= s.length - n; i++) {
                let h = 2166136261
                for (let j = 0; j < n; j++) {
                    h ^= s.charCodeAt(i + j)
                    h = Math.imul(h, 16777619)
                }
                const idx = (h >>> 1) % PROJ_DIM
                const cur = v[idx] ?? 0
                v[idx] = cur + (h & 1) ? 1 : -1
            }
        }

        const out = new Float32Array(DIM)

        v.forEach((x, i) => {
            if (x === 0) return
            const row = proj[i]
            if (!row) return
            row.forEach((r, j) => {
                const cur = out[j] ?? 0
                out[j] = cur + x * r
            })
        })

        // L2 normalize
        let sum = 0
        out.forEach(x => { sum += x * x })
        const norm = Math.sqrt(sum) || 1
        out.forEach((x, i) => { out[i] = x/norm })

        return Array.from(out)
    })
}

// Sparse ±1 / 0 Achlioptas projection (fixed seed)
function getProjection(rows: number, cols: number): Int8Array[] {
    const rng = mulberry32(1337)
    const m = new Array<Int8Array>(rows)

    for (let i = 0; i < rows; i++) {
        const r = new Int8Array(cols)
        for (let j = 0; j < cols; j++) {
            const x = rng()
            r[j] = x < 1 / 6 ? -1 : x < 2 / 6 ? 1 : 0
        }
        m[i] = r
    }
    return m
}

function mulberry32(seed: number) {
    return function () {
        let t = seed += 0x6D2B79F5
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}
