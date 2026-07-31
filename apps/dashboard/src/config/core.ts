import { AuthAdapter } from "@/adapters/api/auth.adapter";
import { MembershipAdapter } from "@/adapters/api/membership.adapter";
import { ProjectAdapter } from "@/adapters/api/project.adapter";
import { TaskAdapter } from "@/adapters/api/task.adapter";
import { TaskStateAdapter } from "@/adapters/api/task-state.adapter";
import { UserAdapter } from "@/adapters/api/user.adapter";
import { WorkspaceAdapter } from "@/adapters/api/workspace.adapter";
import { Core } from "@/core";

const core = new Core({
  api: {
    auth: new AuthAdapter(),
    workspace: new WorkspaceAdapter(),
    project: new ProjectAdapter(),
    membership: new MembershipAdapter(),
    taskState: new TaskStateAdapter(),
    task: new TaskAdapter(),
    user: new UserAdapter(),
  },
});

export default core;
