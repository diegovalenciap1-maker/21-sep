import { SWISS_DATA, SWISS_VARIABLES, SwissRecord } from '../data/swissData';

export interface VariableStats {
  key: string;
  name: string;
  mean: number;
  std: number;
  min: number;
  max: number;
}

export interface ScreeItem {
  component: string;
  index: number;
  eigenvalue: number;
  varianceExplained: number; // percentage (0-100)
  cumulativeVariance: number; // percentage (0-100)
  isKaiser: boolean; // eigenvalue >= 1
  isElbow: boolean; // detected elbow point
}

export interface BiplotPoint {
  id: string;
  district: string;
  religion: 'Católica' | 'Protestante';
  pc1: number;
  pc2: number;
  pc3: number;
  raw: Record<string, number>;
}

export interface LoadingVector {
  variableKey: string;
  variableName: string;
  pc1: number;
  pc2: number;
  pc3: number;
  magnitude: number;
}

export interface PCAResult {
  variables: typeof SWISS_VARIABLES;
  stats: VariableStats[];
  correlationMatrix: number[][];
  eigenvalues: number[];
  eigenvectors: number[][]; // eigenvectors[col] = vector for that PC
  screeData: ScreeItem[];
  elbowIndex: number; // 0-based index of suggested elbow
  scores: BiplotPoint[];
  loadings: LoadingVector[];
  totalVariance: number;
}

// Compute mean and standard deviation (sample, Bessel's correction n-1)
export function computeStats(data: SwissRecord[], keys: (keyof SwissRecord)[]): VariableStats[] {
  const n = data.length;
  return keys.map((key) => {
    const values = data.map((d) => d[key] as number);
    const mean = values.reduce((sum, v) => sum + v, 0) / n;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (n - 1);
    const std = Math.sqrt(variance);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const varMeta = SWISS_VARIABLES.find((v) => v.key === key);
    return {
      key: key as string,
      name: varMeta?.name || (key as string),
      mean,
      std,
      min,
      max,
    };
  });
}

// Compute Pearson correlation matrix
export function computeCorrelationMatrix(data: SwissRecord[], stats: VariableStats[]): number[][] {
  const n = data.length;
  const p = stats.length;
  const matrix: number[][] = Array.from({ length: p }, () => Array(p).fill(0));

  for (let i = 0; i < p; i++) {
    for (let j = 0; j < p; j++) {
      if (i === j) {
        matrix[i][j] = 1.0;
      } else {
        const keyI = stats[i].key as keyof SwissRecord;
        const keyJ = stats[j].key as keyof SwissRecord;
        let sumProd = 0;
        for (let k = 0; k < n; k++) {
          const zI = ((data[k][keyI] as number) - stats[i].mean) / stats[i].std;
          const zJ = ((data[k][keyJ] as number) - stats[j].mean) / stats[j].std;
          sumProd += zI * zJ;
        }
        const r = sumProd / (n - 1);
        matrix[i][j] = r;
      }
    }
  }
  return matrix;
}

// Jacobi eigenvalue algorithm for symmetric matrix
function jacobiEigenvalues(matrix: number[][], maxIter = 100, eps = 1e-12): { values: number[]; vectors: number[][] } {
  const n = matrix.length;
  const A = matrix.map((row) => [...row]);
  const V: number[][] = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => (r === c ? 1.0 : 0.0))
  );

  for (let iter = 0; iter < maxIter; iter++) {
    // Find largest off-diagonal element in absolute value
    let maxOff = 0;
    let p = 0;
    let q = 1;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(A[i][j]) > maxOff) {
          maxOff = Math.abs(A[i][j]);
          p = i;
          q = j;
        }
      }
    }

    if (maxOff < eps) break;

    const app = A[p][p];
    const aqq = A[q][q];
    const apq = A[p][q];

    const theta = (aqq - app) / (2.0 * apq);
    const t = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(1.0 + theta * theta));
    const c = 1.0 / Math.sqrt(1.0 + t * t);
    const s = t * c;

    // Rotate A
    A[p][p] = c * c * app - 2.0 * s * c * apq + s * s * aqq;
    A[q][q] = s * s * app + 2.0 * s * c * apq + c * c * aqq;
    A[p][q] = 0;
    A[q][p] = 0;

    for (let i = 0; i < n; i++) {
      if (i !== p && i !== q) {
        const aip = A[i][p];
        const aiq = A[i][q];
        A[i][p] = c * aip - s * aiq;
        A[p][i] = A[i][p];
        A[i][q] = s * aip + c * aiq;
        A[q][i] = A[i][q];
      }
    }

    // Accumulate eigenvectors in V
    for (let i = 0; i < n; i++) {
      const vip = V[i][p];
      const viq = V[i][q];
      V[i][p] = c * vip - s * viq;
      V[i][q] = s * vip + c * viq;
    }
  }

  const values = Array.from({ length: n }, (_, i) => A[i][i]);
  return { values, vectors: V };
}

// Perform complete PCA on Swiss Dataset
export function performSwissPCA(data: SwissRecord[] = SWISS_DATA): PCAResult {
  const keys = SWISS_VARIABLES.map((v) => v.key);
  const stats = computeStats(data, keys);
  const corrMatrix = computeCorrelationMatrix(data, stats);
  const { values, vectors } = jacobiEigenvalues(corrMatrix);

  // Pair eigenvalues with their respective column eigenvectors
  const p = keys.length;
  const paired: { val: number; vec: number[] }[] = [];
  for (let j = 0; j < p; j++) {
    const colVector = Array.from({ length: p }, (_, i) => vectors[i][j]);
    paired.push({ val: values[j], vec: colVector });
  }

  // Sort descending by eigenvalue
  paired.sort((a, b) => b.val - a.val);

  // Standardize eigenvector direction for reproducibility and clarity (sign flip if needed)
  paired.forEach((item) => {
    // If maximum absolute component is negative, flip vector so principal direction is clear
    let maxAbs = 0;
    let maxVal = 0;
    for (const v of item.vec) {
      if (Math.abs(v) > maxAbs) {
        maxAbs = Math.abs(v);
        maxVal = v;
      }
    }
    if (maxVal < 0) {
      for (let i = 0; i < item.vec.length; i++) {
        item.vec[i] = -item.vec[i];
      }
    }
  });

  const sortedEigenvalues = paired.map((x) => Math.max(0, x.val));
  const sortedEigenvectors = paired.map((x) => x.vec); // sortedEigenvectors[k] is eigenvector of PC(k+1)

  const totalVariance = sortedEigenvalues.reduce((sum, v) => sum + v, 0);

  // Detect Elbow point using maximum distance from line connecting first and last point
  // or second difference
  let maxDist = -1;
  let detectedElbow = 1; // 0-indexed: index 1 means PC2, index 2 means PC3
  const x1 = 0;
  const y1 = sortedEigenvalues[0];
  const x2 = p - 1;
  const y2 = sortedEigenvalues[p - 1];
  const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  for (let i = 1; i < p - 1; i++) {
    const x0 = i;
    const y0 = sortedEigenvalues[i];
    // Perpendicular distance from (x0, y0) to line (x1, y1) - (x2, y2)
    const dist = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) / lineLength;
    if (dist > maxDist) {
      maxDist = dist;
      detectedElbow = i; // in Swiss dataset, this captures PC2/PC3
    }
  }

  // Build Scree Data
  let runningCumulative = 0;
  const screeData: ScreeItem[] = sortedEigenvalues.map((val, idx) => {
    const varPerc = (val / totalVariance) * 100;
    runningCumulative += varPerc;
    return {
      component: `PC${idx + 1}`,
      index: idx + 1,
      eigenvalue: Number(val.toFixed(3)),
      varianceExplained: Number(varPerc.toFixed(1)),
      cumulativeVariance: Number(runningCumulative.toFixed(1)),
      isKaiser: val >= 1.0,
      isElbow: idx === detectedElbow,
    };
  });

  // Calculate Scores (projection of observations onto PCs)
  // Z = standardized matrix (47 x 6)
  // S = Z * V
  const n = data.length;
  const scores: BiplotPoint[] = data.map((d) => {
    const zRow = keys.map((key, kIdx) => ((d[key] as number) - stats[kIdx].mean) / stats[kIdx].std);
    
    // Dot product with PC1, PC2, PC3
    const pc1 = zRow.reduce((sum, z, idx) => sum + z * sortedEigenvectors[0][idx], 0);
    const pc2 = zRow.reduce((sum, z, idx) => sum + z * sortedEigenvectors[1][idx], 0);
    const pc3 = zRow.reduce((sum, z, idx) => sum + z * sortedEigenvectors[2][idx], 0);

    const raw: Record<string, number> = {};
    keys.forEach((k) => {
      raw[k as string] = d[k] as number;
    });

    return {
      id: d.id,
      district: d.district,
      religion: d.Catholic > 50 ? 'Católica' : 'Protestante',
      pc1: Number(pc1.toFixed(3)),
      pc2: Number(pc2.toFixed(3)),
      pc3: Number(pc3.toFixed(3)),
      raw,
    };
  });

  // Calculate Loadings: correlation between variables and PCs
  // Loading = eigenvector[varIndex] * sqrt(eigenvalue)
  const loadings: LoadingVector[] = keys.map((key, varIdx) => {
    const l1 = sortedEigenvectors[0][varIdx] * Math.sqrt(sortedEigenvalues[0]);
    const l2 = sortedEigenvectors[1][varIdx] * Math.sqrt(sortedEigenvalues[1]);
    const l3 = sortedEigenvectors[2][varIdx] * Math.sqrt(sortedEigenvalues[2]);
    const mag = Math.sqrt(l1 * l1 + l2 * l2);
    const varMeta = SWISS_VARIABLES.find((v) => v.key === key);

    return {
      variableKey: key as string,
      variableName: varMeta?.name || (key as string),
      pc1: Number(l1.toFixed(3)),
      pc2: Number(l2.toFixed(3)),
      pc3: Number(l3.toFixed(3)),
      magnitude: Number(mag.toFixed(3)),
    };
  });

  return {
    variables: SWISS_VARIABLES,
    stats,
    correlationMatrix: corrMatrix,
    eigenvalues: sortedEigenvalues,
    eigenvectors: sortedEigenvectors,
    screeData,
    elbowIndex: detectedElbow,
    scores,
    loadings,
    totalVariance,
  };
}

// Reconstruct a specific district's values using k principal components
export function reconstructObservation(
  originalDistrict: SwissRecord,
  kComponents: number,
  pca: PCAResult
): Record<string, { original: number; reconstructed: number; error: number }> {
  const keys = SWISS_VARIABLES.map((v) => v.key);
  const zRow = keys.map((k, idx) => ((originalDistrict[k] as number) - pca.stats[idx].mean) / pca.stats[idx].std);
  
  // Calculate scores up to k
  const scoresK: number[] = [];
  for (let k = 0; k < kComponents; k++) {
    const score = zRow.reduce((sum, z, idx) => sum + z * pca.eigenvectors[k][idx], 0);
    scoresK.push(score);
  }

  // Reconstruct z: zHat = sum(score_k * eigenvector_k)
  const zHat: number[] = Array(keys.length).fill(0);
  for (let k = 0; k < kComponents; k++) {
    for (let j = 0; j < keys.length; j++) {
      zHat[j] += scoresK[k] * pca.eigenvectors[k][j];
    }
  }

  // De-standardize: xHat = zHat * std + mean
  const result: Record<string, { original: number; reconstructed: number; error: number }> = {};
  keys.forEach((k, idx) => {
    const original = originalDistrict[k] as number;
    const reconstructed = zHat[idx] * pca.stats[idx].std + pca.stats[idx].mean;
    const error = Math.abs(original - reconstructed);
    result[k as string] = {
      original: Number(original.toFixed(1)),
      reconstructed: Number(reconstructed.toFixed(1)),
      error: Number(error.toFixed(1)),
    };
  });

  return result;
}
