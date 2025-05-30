import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

// Example enums (replace with your actual enums or fetch from API)
const SERVER_TYPES = [
  "ALL", "CLASSROOM", "GENERAL", "DEPARTMENTAL", "FACULTY", "ADMIN", "STUDENT_BODY"
] as const;
const USER_TYPES = [
  "ALL", "STUDENT",
  "ASSISTANT_PROFR", "ASSOCIATE_PROFR", "PROFR", "HOD", "CLERKS", "COORDINATOR",
  "PRINCIPAL", "DEAN", "DIRECTOR", "LIBRARIAN", "LAB_ASSISTANT", "SECURITY_STAFF",
  "JANITORIAL_STAFF", "TRANSPORT_STAFF", "CAFETERIA_STAFF", "LAB_TECHNICIANS", "IT_STAFF",
  "GUEST", "ALUMINI", "ADMIN"
] as const;
const DEPARTMENTS = ["ALL", "CS", "ME", "EC", "CE"] as const;
const YEARS = ["ALL", 1, 2, 3, 4, 5] as const;
const SEMESTERS = ["ALL", 1, 2, 3, 4, 5, 6, 7, 8] as const;
const SECTIONS = ["ALL", "A", "B", "C", "D"] as const;

// Tier 2 and Tier 1 user types
const TIER2 = [
  "ASSISTANT_PROFR", "ASSOCIATE_PROFR", "PROFR", "HOD", "CLERKS", "COORDINATOR"
];
const TIER1 = [
  "PRINCIPAL", "DEAN", "DIRECTOR", "LIBRARIAN", "LAB_ASSISTANT", "SECURITY_STAFF",
  "JANITORIAL_STAFF", "TRANSPORT_STAFF", "CAFETERIA_STAFF", "LAB_TECHNICIANS", "IT_STAFF"
];

const defaultAudienceGroup = {
  include: true,
  userType: "ALL",
  department: "ALL",
  year: ["ALL"],
  semester: ["ALL"],
  section: ["ALL"],
  usns: [],
};

export default function CreateServer({
  setCreateServerOpen,
  createServerOpen,
  ownedServers = [],
}: {
  setCreateServerOpen: (open: boolean) => void;
  createServerOpen: boolean;
  ownedServers: { id: number; name: string }[];
}) {
  const [formData, setFormData] = useState({
    serverName: "",
    serverType: "CLASSROOM",
    aboutServer: "",
    parentId: "",
    allowAnonymous: false,
    audienceGroups: [{ ...defaultAudienceGroup }],
  });

  // Handle input changes for main form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData(prev => ({
      ...prev,
      [id]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle audience group field change
  const handleAudienceGroupChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newGroups = [...prev.audienceGroups];
      newGroups[index] = { ...newGroups[index], [field]: value };
      return { ...prev, audienceGroups: newGroups };
    });
  };

  // Add or remove audience groups
  const addAudienceGroup = () => {
    setFormData(prev => ({
      ...prev,
      audienceGroups: [...prev.audienceGroups, { ...defaultAudienceGroup }]
    }));
  };
  const removeAudienceGroup = (index: number) => {
    setFormData(prev => ({
      ...prev,
      audienceGroups: prev.audienceGroups.filter((_, i) => i !== index)
    }));
  };

  // Handle array fields (year, semester, section, usns)
  const handleArrayFieldChange = (index: number, field: string, value: string) => {
    let arr: any[] = value.split(",").map(v => v.trim()).filter(Boolean);
    // Convert to number if not "ALL" and if year/semester
    if (["year", "semester"].includes(field)) {
      arr = arr.map(v => v === "ALL" ? "ALL" : Number(v));
    }
    handleAudienceGroupChange(index, field, arr);
  };

  // Determine which fields to show for an audience group based on userType
  const getAudienceFields = (userType: string) => {
    if (userType === "STUDENT") return ["department", "year", "semester", "section", "usns"];
    if (TIER2.includes(userType)) return ["department", "usns"];
    if (TIER1.includes(userType)) return ["usns"];
    return [ "usns"]; 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare final data (convert parentId to number or null)
    const payload = {
      name: formData.serverName,
      type: formData.serverType,
      about: formData.aboutServer,
      parentId: formData.parentId ? Number(formData.parentId) : null,
      allowAnonymous: formData.allowAnonymous,
      audienceGroups: formData.audienceGroups.map(group => ({
        ...group,
        year: group.year.includes("ALL") ? ["ALL"] : group.year.filter(Boolean),
        semester: group.semester.includes("ALL") ? ["ALL"] : group.semester.filter(Boolean),
        section: group.section.includes("ALL") ? ["ALL"] : group.section.filter(Boolean),
        usns: group.usns.filter(Boolean),
      })),
    };
    console.log("Form submitted with data:", payload);
    // TODO: POST to your API here
    setCreateServerOpen(false);
  };

  return (
    <Dialog open={createServerOpen} onOpenChange={setCreateServerOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Server</DialogTitle>
          <DialogDescription>
            Fill out the server details and audience rules.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[80vh] pr-4">
        <form onSubmit={handleSubmit} >
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serverName" className="text-right">Server Name</Label>
              <Input id="serverName" value={formData.serverName} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serverType" className="text-right">Server Type</Label>
              <select id="serverType" value={formData.serverType} onChange={handleChange} className="col-span-3 border rounded px-2 py-1">
                {SERVER_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="aboutServer" className="text-right">About Server</Label>
              <Input id="aboutServer" value={formData.aboutServer} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parentId" className="text-right">Parent Server</Label>
              <select
                id="parentId"
                value={formData.parentId}
                onChange={handleChange}
                className="col-span-3 border rounded px-2 py-1"
              >
                <option value="">None</option>
                {ownedServers.map((srv) => (
                  <option key={srv.id} value={srv.id}>{srv.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="allowAnonymous" className="text-right">Allow Anonymous</Label>
              <input
                id="allowAnonymous"
                type="checkbox"
                checked={formData.allowAnonymous}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>

          <div className="py-2">
            <Label className="font-semibold">Audience Groups</Label>
            {formData.audienceGroups.map((group, idx) => {
              const fields = getAudienceFields(group.userType);
              return (
                <div key={idx} className="border rounded p-3 my-2">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Group {idx + 1}</span>
                    {formData.audienceGroups.length > 1 && (
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeAudienceGroup(idx)}>
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>User Type</Label>
                      <select
                        value={group.userType}
                        onChange={e => handleAudienceGroupChange(idx, "userType", e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      >
                        {USER_TYPES.map((ut) => (
                          <option key={ut} value={ut}>{ut}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Include?</Label>
                      <input
                        type="checkbox"
                        checked={group.include}
                        onChange={e => handleAudienceGroupChange(idx, "include", e.target.checked)}
                      />
                    </div>
                    {fields.includes("department") && (
                      <div>
                        <Label>Department</Label>
                        <select
                          value={group.department}
                          onChange={e => handleAudienceGroupChange(idx, "department", e.target.value)}
                          className="w-full border rounded px-2 py-1"
                        >
                          {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {fields.includes("year") && (
                      <div>
                        <Label>Year (comma separated)</Label>
                        <Input
                          value={group.year.join(",")}
                          onChange={e => handleArrayFieldChange(idx, "year", e.target.value)}
                          placeholder="e.g. ALL,1,2,3,4"
                        />
                      </div>
                    )}
                    {fields.includes("semester") && (
                      <div>
                        <Label>Semester (comma separated)</Label>
                        <Input
                          value={group.semester.join(",")}
                          onChange={e => handleArrayFieldChange(idx, "semester", e.target.value)}
                          placeholder="e.g. ALL,1,2,6,7,8"
                        />
                      </div>
                    )}
                    {fields.includes("section") && (
                      <div>
                        <Label>Section (comma separated)</Label>
                        <Input
                          value={group.section.join(",")}
                          onChange={e => handleArrayFieldChange(idx, "section", e.target.value)}
                          placeholder="e.g. ALL,A,B,C"
                        />
                      </div>
                    )}
                    <div>
                      <Label>USNs (comma separated)</Label>
                      <Input
                        value={group.usns.join(",")}
                        onChange={e => handleArrayFieldChange(idx, "usns", e.target.value)}
                        placeholder="e.g. 1MS-20-CS-001,1MS-20-CS-002"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <Button type="button" variant="outline" onClick={addAudienceGroup}>
              Add Audience Group
            </Button>
          </div>

          <DialogFooter>
            <Button type="submit">Create Server</Button>
          </DialogFooter>
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
