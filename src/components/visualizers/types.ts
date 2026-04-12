// ─── Cell status for Array/Grid visualizers ────────────────────────────────
export type CellStatus =
  | 'default'
  | 'active'       // currently processing
  | 'comparing'    // being compared
  | 'selected'     // in heap / confirmed
  | 'eliminated'   // ruled out / ignored
  | 'result'       // final answer
  | 'highlight'    // generic highlight
  | 'rotten'       // BFS: rotten orange
  | 'fresh'        // BFS: fresh orange
  | 'visited'      // BFS: already visited
  | 'empty';       // empty cell

// ─── Array visualizer ───────────────────────────────────────────────────────
export interface ArrayCell {
  value: string | number;
  status: CellStatus;
  label?: string;   // pointer label below cell (e.g. "L", "MID", "R", "k")
}

export interface ArrayVisualizerData {
  type: 'array';
  cells: ArrayCell[];
  caption?: string;
}

// ─── Heap visualizer (array → binary tree) ──────────────────────────────────
export interface HeapCell {
  value: number | string;
  status: CellStatus;
}

export interface HeapVisualizerData {
  type: 'heap';
  heapType: 'min' | 'max';
  cells: HeapCell[];     // heap array (index 0 = root)
  caption?: string;
  size?: number;         // current logical size (highlight boundary)
}

// ─── Two-heaps visualizer (for Median Finder) ───────────────────────────────
export interface TwoHeapsVisualizerData {
  type: 'two-heaps';
  lo: HeapCell[];   // max-heap lower half (shown as sorted desc)
  hi: HeapCell[];   // min-heap upper half (shown as sorted asc)
  median?: string;
  caption?: string;
}

// ─── Stack visualizer ───────────────────────────────────────────────────────
export interface StackCell {
  value: string | number;
  status: CellStatus;
  annotation?: string;
}

export interface StackVisualizerData {
  type: 'stack';
  cells: StackCell[];    // index 0 = bottom
  action?: 'push' | 'pop' | 'idle';
  actionValue?: string | number;
  caption?: string;
}

// ─── Interval visualizer ────────────────────────────────────────────────────
export interface IntervalBar {
  start: number;
  end: number;
  status: CellStatus;
  label?: string;
}

export interface IntervalVisualizerData {
  type: 'interval';
  intervals: IntervalBar[];
  domain: [number, number];   // [min, max] of timeline
  caption?: string;
}

// ─── BFS Grid visualizer ────────────────────────────────────────────────────
export type GridCell = CellStatus | 'wall';

export interface GridVisualizerData {
  type: 'grid';
  grid: GridCell[][];
  caption?: string;
  queue?: string[];    // items currently in BFS queue
}

// ─── Linked List visualizer (for LRU) ───────────────────────────────────────
export interface ListNode {
  key: string | number;
  value: string | number;
  status: CellStatus;
}

export interface LinkedListVisualizerData {
  type: 'linked-list';
  nodes: ListNode[];     // head → ... → tail order (excluding sentinels)
  caption?: string;
  highlightKey?: string | number;
}

// ─── HashMap visualizer ─────────────────────────────────────────────────────
export interface HashEntry {
  key: string | number;
  value: string | number;
  status: CellStatus;
}

export interface HashMapVisualizerData {
  type: 'hashmap';
  entries: HashEntry[];
  caption?: string;
}

// ─── Union ──────────────────────────────────────────────────────────────────
export type VisualizerData =
  | ArrayVisualizerData
  | HeapVisualizerData
  | TwoHeapsVisualizerData
  | StackVisualizerData
  | IntervalVisualizerData
  | GridVisualizerData
  | LinkedListVisualizerData
  | HashMapVisualizerData;
