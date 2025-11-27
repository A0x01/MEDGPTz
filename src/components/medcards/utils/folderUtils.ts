import { Folder } from '../types';

// Build tree structure from flat folder array
export function buildFolderTree(folders: Folder[]): Folder[] {
  const folderMap = new Map<string, Folder>();
  const rootFolders: Folder[] = [];

  // Create a map of all folders
  folders.forEach((folder) => {
    folderMap.set(folder.id, { ...folder, children: [] });
  });

  // Build tree structure
  folders.forEach((folder) => {
    const currentFolder = folderMap.get(folder.id)!;
    if (folder.parentId === null) {
      rootFolders.push(currentFolder);
    } else {
      const parent = folderMap.get(folder.parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(currentFolder);
      }
    }
  });

  return rootFolders;
}

// Get all parent folders for breadcrumb
export function getFolderPath(folderId: string | null, folders: Folder[]): Folder[] {
  if (!folderId) return [];

  const path: Folder[] = [];
  let currentId: string | null = folderId;

  while (currentId) {
    const folder = folders.find((f) => f.id === currentId);
    if (folder) {
      path.unshift(folder);
      currentId = folder.parentId;
    } else {
      break;
    }
  }

  return path;
}

// Get all descendant folder IDs (for deletion)
export function getDescendantIds(folderId: string, folders: Folder[]): string[] {
  const descendants: string[] = [folderId];
  const children = folders.filter((f) => f.parentId === folderId);

  children.forEach((child) => {
    descendants.push(...getDescendantIds(child.id, folders));
  });

  return descendants;
}

// Sort folders
export function sortFolders(
  folders: Folder[],
  sortBy: 'name' | 'date' | 'items'
): Folder[] {
  return [...folders].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'items':
        return b.deckCount + b.cardCount - (a.deckCount + a.cardCount);
      default:
        return 0;
    }
  });
}

// Calculate folder depth
export function getFolderDepth(folderId: string, folders: Folder[]): number {
  let depth = 0;
  let currentId: string | null = folderId;

  while (currentId) {
    const folder = folders.find((f) => f.id === currentId);
    if (folder && folder.parentId) {
      depth++;
      currentId = folder.parentId;
    } else {
      break;
    }
  }

  return depth;
}
