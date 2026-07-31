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

interface IAuthAdapter {
    signIn(data: SignInData): Promise<void>;
    register(data: RegisterData): Promise<void>;
    validate2FA(data: Validate2FAData): Promise<Session>;
    refreshToken(data: RefreshTokenData): Promise<SessionWithoutRefresh>;
    getProfile(): Promise<Profile>;
}

interface IUserAdapter {
    get(id: string): Promise<User | null>;
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

interface IWorkspaceAdapter {
    create(data: CreateWorkspaceData): Promise<Workspace>;
    update(id: string, data: UpdateWorkspaceData): Promise<Workspace | null>;
    list(params: ListWorkspacesParams): Promise<Paginated<WorkspaceWithMembership>>;
    addMember(workspaceId: string, data: AddMemberData): Promise<void>;
    revokeMember(workspaceId: string, memberId: string): Promise<void>;
}

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

interface IProjectAdapter {
    create(data: CreateProjectData): Promise<Project>;
    get(id: string): Promise<Project | null>;
    update(id: string, data: UpdateProjectData): Promise<Project | null>;
    list(params: ListProjectsParams): Promise<Paginated<Project>>;
    delete(id: string): Promise<void>;
}

interface ListMembersParams extends PaginationParams {
    workspaceId: string;
}

type Member = User & {
    role: MembershipRole;
};

interface IMembershipAdapter {
    list(params: ListMembersParams): Promise<Paginated<Member>>;
}

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

interface ITaskStateAdapter {
    list(params: ListTaskStatesParams): Promise<Paginated<TaskState>>;
    create(projectId: string, data: CreateTaskStateData): Promise<TaskState>;
    update(stateId: string, data: UpdateTaskStateData): Promise<TaskState | null>;
    updateOrder(projectId: string, data: UpdateTaskStatesOrderData): Promise<TaskState[]>;
    delete(stateId: string): Promise<void>;
}

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
}

type Task = {
    id: string;
    title: string;
    content: string;
    dueDate: string | null;
    position: number;
    projectId: string;
    ownerId: string;
    stateId: string | null;
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

interface ITaskAdapter {
    list(params: ListTasksParams): Promise<Paginated<Task>>;
    create(projectId: string, data: CreateTaskData): Promise<Task>;
    get(taskId: string): Promise<Task | null>;
    getBoard(params: GetBoardParams): Promise<Board>;
    update(taskId: string, data: UpdateTaskData): Promise<Task | null>;
    delete(taskId: string): Promise<void>;
}

export { type AddMemberData, type Board, type BoardState, type CreateProjectData, type CreateTaskData, type CreateTaskStateData, type CreateWorkspaceData, type GetBoardParams, type IAuthAdapter, type IMembershipAdapter, type IProjectAdapter, type ITaskAdapter, type ITaskStateAdapter, type IUserAdapter, type IWorkspaceAdapter, type ListMembersParams, type ListProjectsParams, type ListTaskStatesParams, type ListTasksParams, type ListWorkspacesParams, type Member, MembershipRole, type Paginated, type PaginationParams, type Profile, type Project, type RefreshTokenData, type RegisterData, type RelativeOrder, type Session, type SessionWithoutRefresh, type SignInData, type Task, type TaskState, type UpdateProjectData, type UpdateTaskData, type UpdateTaskStateData, type UpdateTaskStatesOrderData, type UpdateWorkspaceData, type User, type Validate2FAData, type Workspace, type WorkspaceWithMembership };
