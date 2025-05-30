"use client";
import {  useMemo } from "react";
import {  Plus, Edit2, Settings, Search } from "lucide-react";
import { TreeNode } from "./TreeNode";
import { Input } from "../ui/input";

function groupServersByType(servers: any[]) {
  const groups: Record<string, any[]> = {};
  servers.forEach((srv) => {
    if (!groups[srv.type]) groups[srv.type] = [];
    groups[srv.type].push({ ...srv });
  });
  return groups;
}

export function HomeSidebar({
  servers,
  ownedServers,
  selectedServerId,
  onSelectServer,
  onEditServer,
  onCreateServer,
}: {
  servers: any[]; 
  ownedServers: any[];
  selectedServerId: number | null;
  onSelectServer: (id: number) => void;
  onEditServer: (id: number) => void;
  onCreateServer: () => void;
}) {

  const grouped = useMemo(() => groupServersByType(servers), [servers]);

  return (
    <aside className="sticky top-0 flex h-full md:w-72 flex-col border-r bg-card text-card-foreground">
      <div className="flex-1 overflow-y-auto">
        <div className=" border-b p-2 text-center">
          <h1 className="text-3xl text-red-600">Digi Bulletin</h1>
        </div>
        <nav className="px-4 text-sm">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search channels..." className="w-full rounded-md bg-background pl-10 h-9" />
            </div>
          </div>
          {/* Grouped servers by type */}
          {Object.entries(grouped).map(([type, group]) => (
            <div key={type} className="mb-4 border-b pb-4">
              <h3 className="mb-1 text-md font-bold uppercase text-red-500">
                {type.replace("_", " ")}
              </h3>
              {group
                .filter((srv) => !ownedServers.some((o) => o.id === srv.id))
                .map((srv) => (
                  <TreeNode
                    key={srv.id}
                    node={srv}
                    selectedId={selectedServerId}
                    onSelect={onSelectServer}
                  />
                ))}
            </div>
          ))}

          {/* Owned Servers */}
          <div className="mb-4">
            <h3 className="mb-1 text-md font-bold uppercase text-red-500">
              Owned Servers
            </h3>
            {ownedServers.map((srv) => (
              <div key={srv.id} className="flex items-center gap-2 mb-1">
                <button
                  className={`flex-1 text-left px-2 py-1 rounded hover:bg-red-500/30 ${
                    selectedServerId === srv.id ? "bg-red-500/60" : ""
                  }`}
                  onClick={() => onSelectServer(srv.id)}
                >
                  {srv.name}
                </button>
                <button
                  className="p-1"
                  onClick={() => onEditServer(srv.id)}
                  aria-label="Edit"
                >
                 <Settings className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </nav>
      </div>
      {/* Create Server Button */}
      <div className="border-t p-4">
        <button
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-red-600 bg-red-500/60 hover:bg-muted"
          onClick={onCreateServer}
        >
          <Plus className="w-4 h-4" />
          Create Server
        </button>
      </div>
    </aside>
  );
}
