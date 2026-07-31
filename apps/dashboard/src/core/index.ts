import {
  IAuthAdapter,
  IMembershipAdapter,
  IProjectAdapter,
  ITaskAdapter,
  ITaskStateAdapter,
  IUserAdapter,
  IWorkspaceAdapter,
} from "@sterenn/api-contracts";
import { AuthService } from "./services/auth.service";
import { MembershipService } from "./services/membership.service";
import { ProjectService } from "./services/project.service";
import { TaskService } from "./services/task.service";
import { TaskStateService } from "./services/task-state.service";
import { UserService } from "./services/user.service";
import { WorkspaceService } from "./services/workspace.service";

type CoreDeps = {
  api: {
    auth: IAuthAdapter;
    workspace: IWorkspaceAdapter;
    project: IProjectAdapter;
    membership: IMembershipAdapter;
    taskState: ITaskStateAdapter;
    task: ITaskAdapter;
    user: IUserAdapter;
  };
};

export class Core {
  readonly auth: AuthService;
  readonly workspace: WorkspaceService;
  readonly project: ProjectService;
  readonly membership: MembershipService;
  readonly taskState: TaskStateService;
  readonly task: TaskService;
  readonly user: UserService;

  constructor(deps: CoreDeps) {
    this.auth = new AuthService(deps.api.auth);
    this.workspace = new WorkspaceService(deps.api.workspace);
    this.project = new ProjectService(deps.api.project);
    this.membership = new MembershipService(deps.api.membership);
    this.taskState = new TaskStateService(deps.api.taskState);
    this.task = new TaskService(deps.api.task);
    this.user = new UserService(deps.api.user);
  }
}
