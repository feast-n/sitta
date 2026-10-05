/**
 * Shared auth form state.
 *
 * This lives outside `actions.ts` on purpose: a `'use server'` module may only
 * export async functions, so exporting the `initialAuthState` object from
 * there throws at runtime.
 */
export interface AuthState {
  error: string | null;
  success: string | null;
}

export const initialAuthState: AuthState = { error: null, success: null };