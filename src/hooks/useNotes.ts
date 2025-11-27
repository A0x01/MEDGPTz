/**
 * Notes Hooks
 *
 * React hooks for notes functionality.
 */

import { useState, useCallback, useMemo } from 'react';
import { notesApi } from '../api';
import { useApi, useMutation, usePaginatedApi } from './useApi';
import type {
  NoteFolder,
  NoteFolderTree,
  NotePreview,
  NoteDetail,
  NoteCreate,
  NoteUpdate,
  NoteFolderCreate,
  NoteVersion,
} from '../api/types';

/**
 * Hook for fetching folders
 */
export function useNoteFolders(parentId?: number) {
  return useApi(
    () => notesApi.getFolders(parentId),
    [parentId]
  );
}

/**
 * Hook for folder tree
 */
export function useNoteFolderTree() {
  return useApi(
    () => notesApi.getFolderTree(),
    []
  );
}

/**
 * Hook for fetching notes with pagination
 */
export function useNotes(params?: {
  folder_id?: number;
  include_archived?: boolean;
  search?: string;
  tags?: string;
}) {
  return usePaginatedApi<NotePreview>(
    (page, pageSize) => notesApi.getNotes({
      ...params,
      page,
      page_size: pageSize,
    })
  );
}

/**
 * Hook for a single note
 */
export function useNote(noteId: number) {
  return useApi(
    () => notesApi.getNote(noteId),
    [noteId]
  );
}

/**
 * Hook for note CRUD operations
 */
export function useNoteCrud() {
  const createMutation = useMutation<NoteDetail, NoteCreate>(notesApi.createNote);
  const updateMutation = useMutation<NoteDetail, { id: number; data: NoteUpdate }>(
    ({ id, data }) => notesApi.updateNote(id, data)
  );
  const deleteMutation = useMutation<{ status: string; message: string }, number>(
    notesApi.deleteNote
  );

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
  };
}

/**
 * Hook for folder CRUD operations
 */
export function useFolderCrud() {
  const createMutation = useMutation<NoteFolder, NoteFolderCreate>(notesApi.createFolder);
  const updateMutation = useMutation<NoteFolder, { id: number; data: Partial<NoteFolderCreate> }>(
    ({ id, data }) => notesApi.updateFolder(id, data)
  );
  const deleteMutation = useMutation<{ status: string; message: string }, { id: number; moveContents?: boolean }>(
    ({ id, moveContents }) => notesApi.deleteFolder(id, moveContents)
  );

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
  };
}

/**
 * Hook for note actions (pin, archive)
 */
export function useNoteActions(noteId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const togglePin = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await notesApi.togglePin(noteId);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  const archive = useCallback(async (archived = true) => {
    setLoading(true);
    setError(null);
    try {
      return await notesApi.archiveNote(noteId, archived);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  return {
    togglePin,
    archive,
    loading,
    error,
  };
}

/**
 * Hook for note versions
 */
export function useNoteVersions(noteId: number) {
  const { data, loading, error, refetch } = useApi(
    () => notesApi.getVersions(noteId),
    [noteId]
  );

  const restoreVersion = useCallback(async (versionId: number) => {
    const result = await notesApi.restoreVersion(noteId, versionId);
    await refetch();
    return result;
  }, [noteId, refetch]);

  return {
    versions: data?.items ?? [],
    total: data?.total ?? 0,
    loading,
    error,
    refetch,
    restoreVersion,
  };
}

/**
 * Hook for note search
 */
export function useNoteSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NotePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (searchQuery: string, options?: {
    folder_id?: number;
    include_archived?: boolean;
  }) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const response = await notesApi.searchNotes({
        q: searchQuery,
        ...options,
      });
      setResults(response.items);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    results,
    loading,
    error,
    search,
    clear,
  };
}

/**
 * Hook for notes statistics
 */
export function useNotesStats() {
  return useApi(() => notesApi.getStats(), []);
}
