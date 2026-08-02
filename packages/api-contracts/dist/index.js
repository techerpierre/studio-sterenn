// src/contracts/common/outputs.ts
var EventStatus = /* @__PURE__ */ ((EventStatus2) => {
  EventStatus2["Processing"] = "processing";
  EventStatus2["Completed"] = "completed";
  EventStatus2["Failed"] = "failed";
  return EventStatus2;
})(EventStatus || {});

// src/contracts/membership/enums.ts
var MembershipRole = /* @__PURE__ */ ((MembershipRole2) => {
  MembershipRole2["ADMIN"] = "ADMIN";
  MembershipRole2["MEMBER"] = "MEMBER";
  return MembershipRole2;
})(MembershipRole || {});

// src/contracts/task/inputs.ts
var TaskExportType = /* @__PURE__ */ ((TaskExportType2) => {
  TaskExportType2["MARKDOWN"] = "markdown";
  TaskExportType2["JSON"] = "json";
  return TaskExportType2;
})(TaskExportType || {});
export {
  EventStatus,
  MembershipRole,
  TaskExportType
};
//# sourceMappingURL=index.js.map