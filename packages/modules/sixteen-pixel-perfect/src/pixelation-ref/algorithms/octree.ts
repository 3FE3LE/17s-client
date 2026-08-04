import type { Rgb } from '../domain/config';

/**
 * Octree color quantization (Gervautz–Purgathofer, simplified).
 *
 *   1. Each unique pixel is inserted into an 8-ary tree of depth 4. The path
 *      at level `k` is determined by bits `[7-k]` of each channel — i.e. the
 *      most significant bits at the top of the tree.
 *   2. Each leaf records the (red, green, blue, count) accumulator across
 *      every pixel routed through it.
 *   3. While the leaf count exceeds `maxColors`, the algorithm picks the
 *      deepest level whose leaves are mergeable and folds them up one
 *      level (eight leaves become a single intermediate whose RGB sums
 *      and counts absorb theirs). This is the "reducible" pass.
 *   4. Once `≤ maxColors` leaves remain, each leaf's average RGB is the
 *      final palette entry.
 *
 * Memory: bounded by the unique color count (≤ 4^4 = 256 leaves at depth
 * 4). Faster than median-cut for large inputs because the splitter cost
 * is bounded by tree depth.
 *
 * Output sorted by L* desc to match `median-cut` ordering — downstream
 * stages (normalize, dither, remap) treat both algorithms interchangeably.
 */

type OctreeNode = {
  children: (OctreeNode | null)[]; // length 8; null = empty
  isLeaf: boolean;
  rSum: number;
  gSum: number;
  bSum: number;
  count: number;
  level: number;
};

const TREE_DEPTH = 4; // 8-bit × 3 channels → 4 levels of 2 bits per axis

export function octreeQuantize(src: Uint8ClampedArray, maxColors: number): Rgb[] {
  if (maxColors < 2) return [meanColor(src)];
  const root = createNode(0);
  const total = Math.floor(src.length / 4);
  let totalCount = 0;
  for (let i = 0; i < total; i += 1) {
    const si = i * 4;
    if (src[si + 3] === 0) continue;
    insert(root, src[si]!, src[si + 1]!, src[si + 2]!, TREE_DEPTH);
    totalCount += 1;
  }
  if (totalCount === 0) return [[0, 0, 0]];

  // Reduce until leaf count ≤ maxColors.
  let leaves = countLeaves(root);
  while (leaves > maxColors) {
    const merged = reduceOnce(root);
    if (!merged) break;
    leaves = countLeaves(root);
  }

  const palette: Rgb[] = [];
  collect(root, palette);
  palette.sort((a, b) => luminance(b) - luminance(a));
  return palette;
}

function createNode(level: number): OctreeNode {
  const children: (OctreeNode | null)[] = new Array(8).fill(null) as (OctreeNode | null)[];
  return {
    children,
    isLeaf: false,
    rSum: 0,
    gSum: 0,
    bSum: 0,
    count: 0,
    level,
  };
}

function insert(node: OctreeNode, r: number, g: number, b: number, level: number): void {
  if (level === 0 || node.isLeaf) {
    node.isLeaf = true;
    node.rSum += r;
    node.gSum += g;
    node.bSum += b;
    node.count += 1;
    return;
  }
  const bit = level - 1;
  const idx = (((r >> bit) & 1) << 2) | (((g >> bit) & 1) << 1) | ((b >> bit) & 1);
  let child = node.children[idx]!;
  if (!child) {
    child = createNode(node.level + 1);
    node.children[idx] = child;
  }
  insert(child, r, g, b, level - 1);
}

function countLeaves(node: OctreeNode): number {
  if (node.isLeaf) return 1;
  let n = 0;
  for (const c of node.children) if (c) n += countLeaves(c);
  return n;
}

interface Reducible {
  node: OctreeNode;
  leaves: number;
}

/** Find an internal node at the deepest level whose children are all leaves. */
function findReducible(
  root: OctreeNode,
  current: OctreeNode,
  best: Reducible | null,
): Reducible | null {
  if (current.isLeaf) return best;
  let candidate = best;
  const childLeaves = countLeaves(current);
  if (childLeaves > 1) {
    const allLeafChildren = current.children.filter((c) => c && c.isLeaf).length;
    // Prefer deeper nodes (more granular merge) but only if merging still saves leaves overall.
    if (allLeafChildren > 1 && (best === null || current.level > best.node.level)) {
      candidate = { node: current, leaves: childLeaves };
    }
  }
  for (const child of current.children) {
    if (child && !child.isLeaf) {
      const deeper = findReducible(root, child, candidate);
      if (deeper && (!candidate || deeper.node.level > candidate.node.level)) candidate = deeper;
    }
  }
  return candidate;
}

function reduceOnce(root: OctreeNode): boolean {
  const target = findReducible(root, root, null);
  if (!target) {
    // Fallback: collapse root into a single leaf.
    if (!root.isLeaf) {
      root.isLeaf = true;
      root.children = new Array(8).fill(null) as (OctreeNode | null)[];
      return true;
    }
    return false;
  }
  // Fold target's children into one leaf.
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (const child of target.node.children) {
    if (!child) continue;
    r += child.rSum;
    g += child.gSum;
    b += child.bSum;
    n += child.count;
  }
  target.node.rSum = r;
  target.node.gSum = g;
  target.node.bSum = b;
  target.node.count = n;
  target.node.isLeaf = true;
  target.node.children = new Array(8).fill(null) as (OctreeNode | null)[];
  return true;
}

function collect(node: OctreeNode, out: Rgb[]): void {
  if (node.isLeaf) {
    if (node.count > 0) {
      out.push([
        Math.round(node.rSum / node.count),
        Math.round(node.gSum / node.count),
        Math.round(node.bSum / node.count),
      ]);
    }
    return;
  }
  for (const child of node.children) if (child) collect(child, out);
}

function meanColor(src: Uint8ClampedArray): Rgb {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  const total = Math.floor(src.length / 4);
  for (let i = 0; i < total; i += 1) {
    const si = i * 4;
    if (src[si + 3] === 0) continue;
    r += src[si]!;
    g += src[si + 1]!;
    b += src[si + 2]!;
    n += 1;
  }
  if (n === 0) return [0, 0, 0];
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
}

function luminance(rgb: Rgb): number {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
