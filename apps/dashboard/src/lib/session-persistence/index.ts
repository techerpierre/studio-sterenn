import env from "@/config/env";
import { Session, WorkspaceWithMembership } from "@sterenn/api-contracts";
import { cookies } from "next/headers";

/**
 * Persist the session in the cookies
 * @param session - The session to persist
 */
export async function persistSession(session: Session): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(env.API_TOKEN_STORED_KEY, session.token);
    cookieStore.set(env.API_REFRESH_TOKEN_STORED_KEY, session.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 31_536_000, // 1 year
        path: "/",
    });
}

/**
 * Clear the session from the cookies
 */
export async function clearSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(env.API_TOKEN_STORED_KEY);
    cookieStore.delete(env.API_REFRESH_TOKEN_STORED_KEY);
    cookieStore.delete(env.CURRENT_WORKSPACE_STORED_KEY);
}

/**
 * Get the session from the cookies
 * @returns The session or null if not authenticated
 */
export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(env.API_TOKEN_STORED_KEY)?.value;
    const refreshToken = cookieStore.get(env.API_REFRESH_TOKEN_STORED_KEY)?.value;
    if (!token || !refreshToken) {
        return null;
    }
    return { token, refreshToken };
}

/**
 * Check if the user is authenticated
 * @returns True if the user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session !== null;
}

/**
 * Persist the current workspace in the cookies as JSON
 * @param workspace - The workspace to persist
 */
export async function persistCurrentWorkspace(workspace: WorkspaceWithMembership): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(env.CURRENT_WORKSPACE_STORED_KEY, JSON.stringify(workspace));
}

/**
 * Clear the current workspace from the cookies
 */
export async function clearCurrentWorkspace(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(env.CURRENT_WORKSPACE_STORED_KEY);
}

/**
 * Get the current workspace from the cookies
 * @returns The workspace or null if not set / invalid
 */
export async function getCurrentWorkspace(): Promise<WorkspaceWithMembership | null> {
    const cookieStore = await cookies();
    const raw = cookieStore.get(env.CURRENT_WORKSPACE_STORED_KEY)?.value;
    if (!raw) {
        return null;
    }

    try {
        const workspace = JSON.parse(raw) as WorkspaceWithMembership;
        if (
            typeof workspace?.id !== "string" ||
            typeof workspace?.name !== "string"
        ) {
            return null;
        }
        return workspace;
    } catch {
        return null;
    }
}
