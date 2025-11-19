/**
 * Pagination utilities for cursor-based pagination
 * 
 * Solves:
 * - Pagination control for nested lists
 * - Proper cursor encoding/decoding
 * - Handling pagination tokens for nested pagination scenarios
 */

export interface PaginationArgs {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
}

export interface PaginationCursor {
  id: string;
  // For nested pagination, include parent context
  parentId?: string;
  parentType?: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

/**
 * Encodes a cursor from an ID (and optional parent context)
 */
export function encodeCursor(id: string, parentId?: string, parentType?: string): string {
  const cursor: PaginationCursor = { id };
  if (parentId) cursor.parentId = parentId;
  if (parentType) cursor.parentType = parentType;
  return Buffer.from(JSON.stringify(cursor)).toString("base64");
}

/**
 * Decodes a cursor to get the ID (and optional parent context)
 */
export function decodeCursor(cursor: string): PaginationCursor {
  try {
    const decoded = Buffer.from(cursor, "base64").toString("utf-8");
    return JSON.parse(decoded) as PaginationCursor;
  } catch {
    throw new Error("Invalid cursor");
  }
}

/**
 * Generic pagination function that works with any array of items with IDs
 */
export function paginate<T extends { id: string }>(
  items: T[],
  args: PaginationArgs,
  parentId?: string,
  parentType?: string
): {
  edges: Array<{ node: T; cursor: string }>;
  pageInfo: PageInfo;
} {
  let result = [...items];

  // Determine pagination direction
  const isForward = args.first !== null && args.first !== undefined;
  const isBackward = args.last !== null && args.last !== undefined;

  if (isForward) {
    // Forward pagination
    const limit = args.first || 10;
    let startIndex = 0;

    if (args.after) {
      const cursor = decodeCursor(args.after);
      startIndex = result.findIndex((item) => item.id === cursor.id) + 1;
      if (startIndex === 0) {
        // Cursor not found, start from beginning
        startIndex = 0;
      }
    }

    result = result.slice(startIndex, startIndex + limit + 1); // +1 to check if there's a next page
    const hasNextPage = result.length > limit;
    if (hasNextPage) {
      result = result.slice(0, limit);
    }

    const edges = result.map((item) => ({
      node: item,
      cursor: encodeCursor(item.id, parentId, parentType),
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: startIndex > 0,
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      },
    };
  } else if (isBackward) {
    // Backward pagination
    const limit = args.last || 10;
    let endIndex = result.length;

    if (args.before) {
      const cursor = decodeCursor(args.before);
      endIndex = result.findIndex((item) => item.id === cursor.id);
      if (endIndex === -1) {
        endIndex = result.length;
      }
    }

    const startIndex = Math.max(0, endIndex - limit - 1); // -1 to check if there's a previous page
    result = result.slice(startIndex, endIndex);
    const hasPreviousPage = startIndex > 0;
    if (hasPreviousPage) {
      result = result.slice(1); // Remove the extra item used for checking
    }

    const edges = result.map((item) => ({
      node: item,
      cursor: encodeCursor(item.id, parentId, parentType),
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage: endIndex < items.length,
        hasPreviousPage,
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      },
    };
  } else {
    // No pagination args, return all items (with cursors for consistency)
    const edges = result.map((item) => ({
      node: item,
      cursor: encodeCursor(item.id, parentId, parentType),
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      },
    };
  }
}

