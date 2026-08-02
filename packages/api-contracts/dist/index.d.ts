interface PaginationParams {
    page?: number;
    take?: number;
}
interface RelativeOrder {
    beforeId?: string;
    afterId?: string;
}

type Paginated<T = any> = {
    results: T[];
    count: number;
};
declare enum EventStatus {
    Processing = "processing",
    Completed = "completed",
    Failed = "failed"
}
interface EventData<T> {
    status: EventStatus;
    data: T;
    message?: string;
}

interface SignInData {
    email: string;
    password: string;
}
interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
interface Validate2FAData {
    pinCode: string;
}
interface RefreshTokenData {
    refreshToken: string;
}

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface Session {
    token: string;
    refreshToken: string;
}
interface SessionWithoutRefresh extends Omit<Session, 'refreshToken'> {
}
interface Profile extends User {
}

declare enum MembershipRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}

interface CreateWorkspaceData {
    name: string;
}
interface UpdateWorkspaceData {
    name: string;
}
interface ListWorkspacesParams extends PaginationParams {
}
interface AddMemberData {
    role: MembershipRole;
    memberId: string;
}

type Workspace = {
    id: string;
    name: string;
};
type WorkspaceWithMembership = Workspace & {
    role: MembershipRole;
};

interface CreateProjectData {
    name: string;
    slug: string;
    workspaceId: string;
}
interface UpdateProjectData {
    name?: string;
    slug?: string;
}
interface ListProjectsParams extends PaginationParams {
    workspaceId: string;
}

type Project = {
    id: string;
    name: string;
    slug: string;
    workspaceId: string;
};

interface ListMembersParams extends PaginationParams {
    workspaceId: string;
}

type Member = User & {
    role: MembershipRole;
};

interface CreateTaskStateData extends RelativeOrder {
    name: string;
    color: string;
}
interface UpdateTaskStateData {
    name?: string;
    color?: string;
    order?: RelativeOrder;
}
interface UpdateTaskStatesOrderData {
    stateIds: string[];
}
interface ListTaskStatesParams extends PaginationParams {
    projectId: string;
}

type TaskState = {
    id: string;
    name: string;
    position: number;
    color: string;
    projectId: string;
};

interface CreateTaskData extends RelativeOrder {
    title: string;
    content?: string;
    dueDate?: string | null;
    stateId: string;
    ownerId?: string;
}
interface UpdateTaskData {
    title?: string;
    content?: string;
    dueDate?: string | null;
    ownerId?: string;
    stateId?: string | null;
    order?: RelativeOrder;
    archived?: boolean;
}
interface ListTasksParams extends PaginationParams {
    projectId: string;
    stateId?: string;
}
interface GetBoardParams {
    projectId: string;
    ownerId?: string;
    tags?: string[];
}
declare enum TaskExportType {
    MARKDOWN = "markdown",
    JSON = "json"
}
interface TaskExportParams {
    projectId: string;
    type: TaskExportType;
}

type Tag = {
    id: string;
    name: string;
    color: string;
    projectId: string;
};

type TaskTag = Tag;
type TaskOwner = {
    id: string;
    firstName: string;
    lastName: string;
};
type Task = {
    id: string;
    title: string;
    content: string;
    dueDate: string | null;
    position: number;
    projectId: string;
    ownerId: string;
    stateId: string | null;
    tags: TaskTag[];
    owner: TaskOwner;
};
type BoardState = {
    id: string;
    name: string;
    position: number;
    color: string;
    projectId: string;
    tasks: Task[];
};
type Board = {
    projectId: string;
    states: BoardState[];
};
type TaskExportEventData = EventData<{
    ressourceUrl: string | null;
}>;

interface CreateTagData {
    name: string;
    color: string;
    projectId: string;
}
interface UpdateTagData {
    name?: string;
    color?: string;
}
interface ListTagsParams extends PaginationParams {
    projectId: string;
    search?: string;
}
interface AttachTaskTagsData {
    tagId: string;
}

export { type AddMemberData, type AttachTaskTagsData, type Board, type BoardState, type CreateProjectData, type CreateTagData, type CreateTaskData, type CreateTaskStateData, type CreateWorkspaceData, type EventData, EventStatus, type GetBoardParams, type ListMembersParams, type ListProjectsParams, type ListTagsParams, type ListTaskStatesParams, type ListTasksParams, type ListWorkspacesParams, type Member, MembershipRole, type Paginated, type PaginationParams, type Profile, type Project, type RefreshTokenData, type RegisterData, type RelativeOrder, type Session, type SessionWithoutRefresh, type SignInData, type Tag, type Task, type TaskExportEventData, type TaskExportParams, TaskExportType, type TaskOwner, type TaskState, type TaskTag, type UpdateProjectData, type UpdateTagData, type UpdateTaskData, type UpdateTaskStateData, type UpdateTaskStatesOrderData, type UpdateWorkspaceData, type User, type Validate2FAData, type Workspace, type WorkspaceWithMembership };
