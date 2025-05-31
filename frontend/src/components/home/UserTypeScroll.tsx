import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "../ui/label";

const UserType={
    "Tier 3":[{
        name:"STUDENT",
        value:"STUDENT"
    }],
    "Tier 2":[{
        name:"ASSISTANT PROFESSOR",
        value:"ASSISTANT_PROFR",
    },{
        name:"ASSOCIATE PROFESSOR",
        value:"ASSOCIATE_PROFR"
    },{
        name:"PROFESSOR",
        value:"PROFR"
    },{
        name:"HEAD OF DEPARTMENT",
        value:"HOD"
    },{
        name:"REGISTRAR",
        value:"REGISTRAR"
    },{
        name:"CLERK",
        value:"CLERKS"
    },{
        name:"COORDINATOR",
        value:"COORDINATOR"
    }],
    "Tier 1":[{
        name:"PRINCIPAL",
        value:"PRINCIPAL"
    },{
        name:"DEAN",
        value:"DEAN"
    },{
        name:"DIRECTOR",
        value:"DIRECTOR"
    },{
        name:"LIBRARIAN",
        value:"LIBRARIAN"
    },{
        name:"LAB ASSISTANT",
        value:"LAB_ASSISTANT"
    },{
        name:"SECURITY STAFF",
        value:"SECURITY_STAFF"
    },{
        name:"JANITORIAL STAFF",
        value:"JANITORIAL_STAFF"
    },{
        name:"TRANSPORT STAFF",
        value:"TRANSPORT_STAFF"
    },{
        name:"CAFETERIA STAFF",
        value:"CAFETERIA_STAFF"
    },{
        name:"LAB TECHNICIANS",
        value:"LAB_TECHNICIANS"
    },{
        name:"IT STAFF",
        value:"IT_STAFF"
    }],
    "Tier 0":[{
        name:"GUEST",
        value:"GUEST"
    },{
        name:"ALUMNI",
        value:"ALUMNI"
    },{
        name:"ADMIN",
        value:"ADMIN"
    }]
}

export function UserTypeScroll({
  index,
  value,
  onChange,
}: {
  index: number;
  value: string;
  onChange: (index: number, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
    <Label>Audience Type</Label>
    <Select value={value} onValueChange={(val) => onChange(index, val)}>
      <SelectTrigger className="w-full border rounded px-2 py-1">
        <SelectValue placeholder="Select User Type" className="text-red-500"/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
            <SelectLabel className="text-red-500">Public</SelectLabel>
            <SelectItem value="ALL">All</SelectItem>
        </SelectGroup>
        {Object.entries(UserType).map(([tier, items]) => (
          <SelectGroup key={tier}>
            <SelectLabel className="text-red-500">{tier}</SelectLabel>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
    </div>
  );
}
