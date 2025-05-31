import * as React from "react"

import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";

const DepartmentType = [
  {
    name:"All Departments",
    value: "ALL",
  },
  {
    name: "Aerospace Engineering",
    value: "AE",
  },
  {
    name: "Artificial Intelligence and Data Science",
    value: "AD",
  },
  {
    name: "Artificial Intelligence and Machine Learning",
    value: "AI",
  },
  {
    name: "Biotechnology",
    value: "BT",
  },
  {
    name: "Chemical Engineering",
    value: "CH",
  },
  {
    name: "Civil Engineering",
    value: "CV",
  },
  {
    name: "Computer Science and Engineering",
    value: "CS",
  },
  {
    name: "Computer Science and Engineering (AI-ML)",
    value: "CI",
  },
  {
    name: "Computer Science and Engineering (Cyber Security)",
    value: "CY",
  },
  {
    name: "Electrical and Electronics Engineering",
    value: "EE",
  },
  {
    name: "Electronics & Communication Engineering",
    value: "EC",
  },
  {
    name: "Electronics & Instrumentation Engineering",
    value: "EI",
  },
  {
    name: "Electronics & Telecommunication Engineering",
    value: "ET",
  },
  {
    name: "Industrial Engineering & Management",
    value: "IM",
  },
  {
    name: "Information Science & Engineering",
    value: "IS",
  },
  {
    name: "Mechanical Engineering",
    value: "ME",
  },
  {
    name: "Medical Electronics Engineering",
    value: "MD",
  },
  {
    name: "Architecture",
    value: "AT",
  },
];

export function DepartmentTypeScroll({
  index,
  value,
  onChange,
}: {
  index: number;
  value: string[];
  onChange: (index: number, value: string[]) => void;
}) {

  const handleToggle = (deptValue: string) => {
    const newValue = value.includes(deptValue)
      ? value.filter(v => v !== deptValue)
      : [...value, deptValue];
    onChange(index, newValue);
  };


  return (
    <div className="w-full flex flex-col gap-2 overflow-x-hidden flex-grow-0">
      <Label>Departments</Label>
      <Popover >
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {value.length > 0
              ? DepartmentType.filter(d => value.includes(d.value)).map(d => d.name).join(", ")
              : "Select department(s)"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 z-[999999]"
          style={{pointerEvents: "auto"}}>
        <ScrollArea className="h-60">
          <div className="flex flex-col gap-2 z-50 max-w-full">
            {DepartmentType.map(dept => (
              <label key={dept.value} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={value.includes(dept.value)}
                  onCheckedChange={() => handleToggle(dept.value)}
                />
                <span>{dept.name}</span>
              </label>
            ))}
          </div>
        </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}

