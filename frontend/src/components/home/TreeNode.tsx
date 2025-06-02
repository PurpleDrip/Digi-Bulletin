import { useState } from "react";
import { ChevronDown, ChevronRight, Users, Shield, Book, User } from "lucide-react";
import {
  GraduationCap,
  Calendar,
  Mic,
  AlertCircle,
  MessageCircle,
  Users2,
  LifeBuoy,
  FlaskConical,
  Hammer,
  FileText,
  Briefcase,
  Building2
} from 'lucide-react';

const typeIconMap: Record<string, any> = {
  GENERAL: Book,
  DEPARTMENTAL: Shield,
  CLASSROOM: Users,
  FACULTY: User,
  ADMINISTRATION: Building2,
  STUDENT_BODY: Users2,
  SEMINAR: Mic,
  EVENT: Calendar,
  ANNOUNCEMENT: AlertCircle,
  DISCUSSION: MessageCircle,
  CLUB: Users,
  SUPPORT: LifeBuoy,
  RESEARCH: FlaskConical,
  WORKSHOP: Hammer,
  EXAM: FileText,
  ALUMNI: GraduationCap,
};

export function TreeNode({
  node,
  selectedId,
  onSelect,
  level = 0,
}: {
  node: any;
  selectedId: number | null;
  onSelect: (id: number) => void;
  level?: number;
}) {
  const [open, setOpen] = useState(false); // All nodes closed by default
  const Icon = typeIconMap[node.type] || Users;
  const hasChildren = node.childServers && node.childServers.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-muted transition ${
          selectedId === node.id ? "bg-red-500" : ""
        }`}
        style={{ paddingLeft: `${level * 14}px` }}
        onClick={() => {
          onSelect(node.id);
          if (hasChildren) setOpen((prev) => !prev);
        }}
      >
        {hasChildren ? (
          open ? (
            <ChevronDown className="w-4 h-4"/>
          ) : (
            <ChevronRight className="w-4 h-4"/>
          )
        ) : (
          <span className="w-4 h-4" />
        )}
        <Icon className="w-4 h-4"/>
        <span>{node.name}</span>
      </div>
      {hasChildren && open && (
        <div>
          {node.childServers.map((child: any) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}


