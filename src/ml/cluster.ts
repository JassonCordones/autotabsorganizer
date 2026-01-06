export function kMeans(vectors: number[][], k: number, it = 10): number[] {
    if (vectors.length === 0) throw new Error("Vectors not defined");
    if (k <= 0 || k > vectors.length) throw new Error("Invalid k");

    const first = vectors[0];
    if (!first || first.length === 0) throw new Error("Invalid dimensions");
    const dim = first.length;

    // Validate all vectors
    for (const v of vectors) {
        if (!v || v.length !== dim) throw new Error("Inconsistent dimensions");
    }

    const centroids: number[][] = [];
    for (let i = 0; i < k; i++) {
        const v = vectors[i];
        if (!v) throw new Error("Invalid centroid source");
        centroids.push([...v]);
    }

    const labels = new Array<number>(vectors.length).fill(0);

    for (let step = 0; step < it; step++) {
        for (let i = 0; i < vectors.length; i++) {
            const vec = vectors[i];
            if (!vec) throw new Error("Invalid vector");

            let best = 0;
            let bestD = Infinity;

            for (let c = 0; c < centroids.length; c++) {
                const centroid = centroids[c];
                if (!centroid) throw new Error("Invalid centroid");

                let d = 0;
                for (let j = 0; j < dim; j++) {
                    const vj = vec[j];
                    const cj = centroid[j];
                    if (vj === undefined || cj === undefined) {
                        throw new Error("Index out of bounds");
                    }
                    const diff = vj - cj;
                    d += diff * diff;
                }

                if (d < bestD) {
                    bestD = d;
                    best = c;
                }
            }
            labels[i] = best;
        }
    }
    return labels;
}
