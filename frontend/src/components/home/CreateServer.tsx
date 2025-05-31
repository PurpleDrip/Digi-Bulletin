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
import { UserTypeScroll } from "./UserTypeScroll";
import { Checkbox } from "../ui/checkbox";
import { DepartmentTypeScroll } from "./DepartmentTypeScroll";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { createServer } from "@/api/server";
import { useToast } from "@/hooks/use-toast";

// Example enums (replace with your actual enums or fetch from API)
const SERVER_TYPES = [
  "SEMINAR","EVENT","GENERAL",
  "ANNOUNCEMENT", "CLASSROOM", "DISCUSSION", "CLUB", "DEPARTMENTAL",
  "STUDENT_BODY", "SUPPORT", "RESEARCH", "WORKSHOP", "EXAM", "ALUMNI", "FACULTY", "ADMINISTRATION"
] as const;
const USER_TYPES = [
  "ALL", "STUDENT",
  "ASSISTANT_PROFR", "ASSOCIATE_PROFR", "PROFR", "HOD", "CLERKS", "COORDINATOR",
  "PRINCIPAL", "DEAN", "DIRECTOR", "LIBRARIAN", "LAB_ASSISTANT", "SECURITY_STAFF",
  "JANITORIAL_STAFF", "TRANSPORT_STAFF", "CAFETERIA_STAFF", "LAB_TECHNICIANS", "IT_STAFF",
  "GUEST", "ALUMINI", "ADMIN"
] as const;

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
  department: ["ALL"],
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
    serverType: "",
    aboutServer: "",
    parentId: "",
    allowAnonymous: false,
    audienceGroups: [{ ...defaultAudienceGroup }],
  });

  const { toast } = useToast();

  // Handle input changes for main form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData(prev => ({
      ...prev,
      [id]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const [tempAudienceInputs, setTempAudienceInputs] = useState(
    formData.audienceGroups.map(group => ({
      year: group.year.join(","),
      semester: group.semester.join(","),
      section: group.section.join(","),
      usns: group.usns.join(","),
    }))
  );

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

  const handleSubmit = async (e: React.FormEvent) => {
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
        department:Array.isArray(group.department) ? group.department : [group.department],
        year: group.year.includes("ALL") ? ["ALL"] : group.year.filter(Boolean),
        semester: group.semester.includes("ALL") ? ["ALL"] : group.semester.filter(Boolean),
        section: group.section.includes("ALL") ? ["ALL"] : group.section.filter(Boolean),
        usns: group.usns.filter(Boolean),
      })),
    };
    console.log("Form submitted with data:", payload);
    

    try{
      const res=await createServer(payload);
      console.log("Server created successfully:", res);

      toast({
        title: "Server Created",
        description: "Your server has been created successfully."
      });

      setCreateServerOpen(false);
    }catch(err){
      console.log("Error creating server:", err);
      toast({
        title: "Error",
        description: "Failed to create server. Please try again.",
        variant: "destructive"
      });
    }
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
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 items-start mt-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serverName" className="text-right">Server Name</Label>
              <Input id="serverName" value={formData.serverName} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serverType" className="text-right">Server Type</Label>
              <Select
                value={formData.serverType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, serverType: value }))
                }
              >
                <SelectTrigger id="serverType" className="col-span-3">
                  <SelectValue placeholder="Select server type" />
                </SelectTrigger>
                <SelectContent>
                  {SERVER_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="aboutServer" className="text-right">About Server</Label>
              <Input id="aboutServer" value={formData.aboutServer} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parentId">Parent Server</Label>
              <Select
                value={formData.parentId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, parentId: value }))
                }
              >
                <SelectTrigger id="parentId" className="col-span-3">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undefined">None</SelectItem>
                  {ownedServers.map((srv) => (
                    <SelectItem key={srv.id} value={srv.id.toString()}>
                      {srv.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center mb-2 gap-2">
              <Checkbox
                id="allowAnonymous"
                checked={formData.allowAnonymous}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  allowAnonymous: checked === true
                }))}
              />
              <Label htmlFor="allowAnonymous">Allow Anonymous Messaging</Label>
            </div>
          </div>

          <div className="py-2">
            <Label className="text-md text-red-500">Audience Groups</Label>
            {formData.audienceGroups.map((group, idx) => {
              const fields = getAudienceFields(group.userType);
              return (
                <div key={idx} className="border rounded p-3 my-2">
                  <div className="flex flex-col mb-2 ">
                    <span className="font-medium text-left">Group {idx + 1}</span>
                    {formData.audienceGroups.length > 1 && (
                      <Button className="w-20 ml-auto" type="button" variant="destructive" size="sm" onClick={() => removeAudienceGroup(idx)}>
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center mb-2 gap-2"> 
                      <Checkbox
                        id={`include-${idx}`}
                        checked={group.include}
                        onCheckedChange={(checked) =>
                          handleAudienceGroupChange(idx, "include", checked === true)
                        }
                      />
                      <Label htmlFor={`include-${idx}`}>Include</Label>
                    </div>

                    <UserTypeScroll
                      index={idx}
                      value={group.userType}
                      onChange={(index, value) => handleAudienceGroupChange(index, "userType", value)}
                    />

                    <div className="flex items-center justify-between px-4 py-2 gap-4">
                      <div className="w-1/2 flex flex-col gap-2 flex-shrink-0 flex-grow-0">
                        <Label>USNs (comma separated)</Label>
                        <Input
                          value={tempAudienceInputs[idx].usns}
                          onChange={e => {
                            const value = e.target.value;
                            setTempAudienceInputs(inputs =>
                              inputs.map((input, i) =>
                                i === idx ? { ...input, usns: value } : input
                              )
                            );
                          }}
                          onBlur={e => {
                            const arr = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                            handleAudienceGroupChange(idx, "usns", arr);
                          }}
                          placeholder="e.g. 1MS20CS001,1MS20CS002"
                        />
                      </div>
                      {fields.includes("department") && (
                      <DepartmentTypeScroll
                        index={idx}
                        value={Array.isArray(group.department) ? group.department : [group.department]}
                        onChange={(index, value) => handleAudienceGroupChange(index, "department", value)}
                      />)}
                    </div>

                    {fields.includes("year") && (
                      <>
                    <Label>Year (comma separated)</Label>
                    <Input
                      value={tempAudienceInputs[idx].year}
                      onChange={e => {
                        const value = e.target.value;
                        setTempAudienceInputs(inputs =>
                          inputs.map((input, i) =>
                            i === idx ? { ...input, year: value } : input
                          )
                        );
                      }}
                      onBlur={e => {
                        const arr = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                        handleAudienceGroupChange(idx, "year", arr);
                      }}
                      placeholder="e.g. ALL,1,2,3,4"
                    />
                    </>
                    )}
                    {fields.includes("semester") && (
                    <>
                    <Label>Semester (comma separated)</Label>
                    <Input
                      value={tempAudienceInputs[idx].semester}
                      onChange={e => {
                        const value = e.target.value;
                        setTempAudienceInputs(inputs =>
                          inputs.map((input, i) =>
                            i === idx ? { ...input, semester: value } : input
                          )
                        );
                      }}
                      onBlur={e => {
                        const arr = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                        handleAudienceGroupChange(idx, "semester", arr.map(v => v === "ALL" ? "ALL" : Number(v)));
                      }}
                      placeholder="e.g. ALL,1,2,6,7,8"
                    />
                    </>
                    )}
                    {fields.includes("section") && (
                    <>
                    <Label>Section (comma separated)</Label>
                    <Input
                      value={tempAudienceInputs[idx].section}
                      onChange={e => {
                        const value = e.target.value;
                        setTempAudienceInputs(inputs =>
                          inputs.map((input, i) =>
                            i === idx ? { ...input, section: value } : input
                          )
                        );
                      }}
                      onBlur={e => {
                        const arr = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                        handleAudienceGroupChange(idx, "section", arr);
                      }}
                      placeholder="e.g. ALL,A,B,C"
                    />
                    </>
                    )}
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
