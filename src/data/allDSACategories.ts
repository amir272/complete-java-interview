/**
 * Merges the base dsaCategories with all extra problems.
 * Import from this file instead of dsaProblems.ts for the full set.
 */
import { dsaCategories, DSACategory } from './dsaProblems';
import {
  linkedListExtra,
  heapsExtra,
  stacksExtra,
  hashingExtra,
  queuesExtra,
  intervalsExtra,
  binarySearchExtra,
} from './dsaProblemsExtra';

function mergeInto(categories: DSACategory[], id: string, extra: any[]) {
  return categories.map(c =>
    c.id === id ? { ...c, problems: [...c.problems, ...extra] } : c
  );
}

export const allDSACategories: DSACategory[] = (() => {
  let cats = [...dsaCategories];
  cats = mergeInto(cats, 'heaps',         heapsExtra);
  cats = mergeInto(cats, 'stacks',        stacksExtra);
  cats = mergeInto(cats, 'hashing',       hashingExtra);
  cats = mergeInto(cats, 'queues',        queuesExtra);
  cats = mergeInto(cats, 'intervals',     intervalsExtra);
  cats = mergeInto(cats, 'binary-search', binarySearchExtra);
  cats = mergeInto(cats, 'linked-list',   linkedListExtra);
  return cats;
})();
