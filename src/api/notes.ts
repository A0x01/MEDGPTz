/**
 * Notes API Service
 *
 * Handles all notes-related API calls.
 */

import { apiClient } from './client';
import type {
  PaginatedResponse,
  NoteFolder,
  NoteFolderTree,
  NotePreview,
  Note,
  NoteDetail,
  NoteVersion,
  NoteCreate,
  NoteUpdate,
  NoteFolderCreate,
  NotesStats,
} from './types';

const BASE_PATH = '/student/notes';

export const notesApi = {
  // ========================================================================
  // Folders
  // ========================================================================

  /**
   * Get folders
   */
  getFolders: (parentId?: number) =>
    apiClient.get<{ items: NoteFolder[]; total: number }>(
      `${BASE_PATH}/folders`,
      { parent_id: parentId }
    ),

  /**
   * Get folder tree
   */
  getFolderTree: () =>
    apiClient.get<NoteFolderTree[]>(`${BASE_PATH}/folders/tree`),

  /**
   * Create folder
   */
  createFolder: (data: NoteFolderCreate) =>
    apiClient.post<NoteFolder>(`${BASE_PATH}/folders`, data),

  /**
   * Get folder by ID
   */
  getFolder: (id: number) =>
    apiClient.get<NoteFolder>(`${BASE_PATH}/folders/${id}`),

  /**
   * Update folder
   */
  updateFolder: (id: number, data: Partial<NoteFolderCreate>) =>
    apiClient.put<NoteFolder>(`${BASE_PATH}/folders/${id}`, data),

  /**
   * Delete folder
   */
  deleteFolder: (id: number, moveContents = false) =>
    apiClient.delete<{ status: string; message: string }>(
      `${BASE_PATH}/folders/${id}?move_contents=${moveContents}`
    ),

  // ========================================================================
  // Notes
  // ========================================================================

  /**
   * Get notes
   */
  getNotes: (params?: {
    folder_id?: number;
    include_archived?: boolean;
    search?: string;
    tags?: string;
    page?: number;
    page_size?: number;
  }) => apiClient.get<PaginatedResponse<NotePreview>>(
    BASE_PATH,
    params
  ),

  /**
   * Create note
   */
  createNote: (data: NoteCreate) =>
    apiClient.post<Note>(BASE_PATH, data),

  /**
   * Get note by ID
   */
  getNote: (id: number) =>
    apiClient.get<NoteDetail>(`${BASE_PATH}/${id}`),

  /**
   * Update note
   */
  updateNote: (id: number, data: NoteUpdate) =>
    apiClient.put<Note>(`${BASE_PATH}/${id}`, data),

  /**
   * Delete note
   */
  deleteNote: (id: number) =>
    apiClient.delete<{ status: string; message: string }>(`${BASE_PATH}/${id}`),

  /**
   * Toggle pin
   */
  togglePin: (id: number) =>
    apiClient.post<Note>(`${BASE_PATH}/${id}/pin`),

  /**
   * Archive/unarchive note
   */
  archiveNote: (id: number, archived = true) =>
    apiClient.post<Note>(`${BASE_PATH}/${id}/archive?archived=${archived}`),

  // ========================================================================
  // Search
  // ========================================================================

  /**
   * Search notes
   */
  searchNotes: (params: {
    q: string;
    folder_id?: number;
    include_archived?: boolean;
    page?: number;
    page_size?: number;
  }) => apiClient.get<PaginatedResponse<NotePreview>>(
    `${BASE_PATH}/search`,
    params
  ),

  // ========================================================================
  // Versions
  // ========================================================================

  /**
   * Get note versions
   */
  getVersions: (noteId: number) =>
    apiClient.get<{ items: NoteVersion[]; total: number }>(
      `${BASE_PATH}/${noteId}/versions`
    ),

  /**
   * Get specific version
   */
  getVersion: (noteId: number, versionId: number) =>
    apiClient.get<NoteVersion>(`${BASE_PATH}/${noteId}/versions/${versionId}`),

  /**
   * Restore version
   */
  restoreVersion: (noteId: number, versionId: number) =>
    apiClient.post<Note>(`${BASE_PATH}/${noteId}/versions/${versionId}/restore`),

  // ========================================================================
  // Stats
  // ========================================================================

  /**
   * Get notes statistics
   */
  getStats: () =>
    apiClient.get<NotesStats>(`${BASE_PATH}/stats`),
};
