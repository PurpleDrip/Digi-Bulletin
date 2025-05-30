import { USER_TYPES_ARRAY, USER_TYPES_CONFIG, doesUserTypeNeedDepartment, doesUserTypeNeedStudentInfo, DEPARTMENT_OPTIONS } from "@/lib/constants";
import { useState } from "react";
import type { UserTypeValue } from "@/lib/constants";

// ...other imports

export function AudienceGroupForm({
  group,
  index,
  onChange,
  onRemove,
  ownedServers,
}:{
    group: {
        userType: string;
        include: boolean;
        department: string;
        year: string[];
        semester: string[];
        section: string[];
        usns: string[];
    };
    index: number;
    onChange: (index: number, field: string, value: any) => void;
    onRemove?: (index: number) => void;
    ownedServers?: { id: string; name: string }[];
}) {
  // Handler for userType change
  const handleUserTypeChange = (value: string) => {
    onChange(index, "userType", value);
    // Optionally reset fields when userType changes
    if (!doesUserTypeNeedDepartment(value as UserTypeValue)) onChange(index, "department", "ALL");
    if (!doesUserTypeNeedStudentInfo(value as UserTypeValue)) {
      onChange(index, "year", ["ALL"]);
      onChange(index, "semester", ["ALL"]);
      onChange(index, "section", ["ALL"]);
    }
  };

  const showDepartment = doesUserTypeNeedDepartment(group.userType as UserTypeValue);
  const showStudentFields = doesUserTypeNeedStudentInfo(group.userType as UserTypeValue);

  return (
    <div className="border rounded p-3 my-2 bg-muted/30">
      <div className="flex justify-between mb-2">
        <span className="font-medium">Audience Group {index + 1}</span>
        {onRemove && (
          <button type="button" className="text-red-500 text-xs" onClick={() => onRemove(index)}>
            Remove
          </button>
        )}
      </div>
      {/* User Type Dropdown */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">User Type</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={group.userType}
          onChange={e => handleUserTypeChange(e.target.value)}
        >
          {USER_TYPES_ARRAY.map((ut) => (
            <option key={ut.value} value={ut.value}>{ut.label}</option>
          ))}
        </select>
        <span className="block text-xs text-muted-foreground mt-1">
          {USER_TYPES_CONFIG[group.userType as UserTypeValue]?.description}
        </span>
      </div>
      {/* Include Checkbox */}
      <div className="mb-2 flex items-center gap-2">
        <input
          type="checkbox"
          checked={group.include}
          onChange={e => onChange(index, "include", e.target.checked)}
        />
        <label className="text-sm">Include</label>
      </div>
      {/* Department Dropdown */}
      {showDepartment && (
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Department</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={group.department}
            onChange={e => onChange(index, "department", e.target.value)}
          >
            <option value="ALL">ALL</option>
            {DEPARTMENT_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
      )}
      {/* Student Info Fields */}
      {showStudentFields && (
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-sm font-medium mb-1">Year (comma separated)</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={group.year.join(",")}
              onChange={e => onChange(index, "year", e.target.value.split(",").map(v => v.trim()).filter(Boolean))}
              placeholder="ALL,1,2,3,4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Semester (comma separated)</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={group.semester.join(",")}
              onChange={e => onChange(index, "semester", e.target.value.split(",").map(v => v.trim()).filter(Boolean))}
              placeholder="ALL,1,2,3,4,5,6,7,8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Section (comma separated)</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={group.section.join(",")}
              onChange={e => onChange(index, "section", e.target.value.split(",").map(v => v.trim()).filter(Boolean))}
              placeholder="ALL,A,B,C"
            />
          </div>
        </div>
      )}
      {/* USNs Field (always shown) */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">USNs (comma separated)</label>
        <input
          className="w-full border rounded px-2 py-1"
          value={group.usns.join(",")}
          onChange={e => onChange(index, "usns", e.target.value.split(",").map(v => v.trim()).filter(Boolean))}
          placeholder="e.g. 1MS-20-CS-001,1MS-20-CS-002"
        />
      </div>
    </div>
  );
}
