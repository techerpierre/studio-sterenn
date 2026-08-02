"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  EventStatus: () => EventStatus,
  MembershipRole: () => MembershipRole,
  TaskExportType: () => TaskExportType
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EventStatus,
  MembershipRole,
  TaskExportType
});
//# sourceMappingURL=index.cjs.map