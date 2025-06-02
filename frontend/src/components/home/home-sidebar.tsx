"use client";
import {  useEffect, useMemo, useState } from "react";
import {  Plus, Edit2, Settings, Search, LogOut } from "lucide-react";
import { TreeNode } from "./TreeNode";
import { Input } from "../ui/input";
import Logo from "../visuals/Logo";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { clearUser } from "@/store/userSlice";
import { logout } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  onDeleteServer,
}: {
  servers: any[]; 
  ownedServers: any[];
  selectedServerId: number | null;
  onSelectServer: (id: number) => void;
  onEditServer: (id: number) => void;
  onCreateServer: () => void;
  onDeleteServer:(id:number)=>void;
}) {
  const dispatch=useDispatch();
  const { toast } = useToast();
  const router = useRouter();

  const [id, setId] = useState<number|null>(null);
  const [name, setName] = useState<string|null>("");
  const [usn, setusn] = useState<string|null>("")
  const [type, setType] = useState<string|null>("");
  const [department,setDepartment]=useState<string|null>("");
  const [semester,setSemester]=useState<number|null>(null);
  const [section, setSection] = useState<string|null>("")

  const userData=useSelector((state:RootState)=>state.user);

  useEffect(()=>{
    if(userData){
      console.log("user",userData);
      setId(userData.id);
      setName(userData.name);
      setusn(userData.usn)
      setType(userData.type);
      setDepartment(userData.department);
      setSemester(userData.semester);
      setSection(userData.section);
    }
  },[userData])
  
  const handleLogout=async ()=>{

    try{
      const res=await logout();

      if(res.data.success){
        dispatch(clearUser());

        toast({
          title: "Successful Logout",
          description: "Redirecting to Login Page.",
        });
        router.push("/");
      }
    }catch(err){
      toast({
        title: "Authentication Error",
        description: "Couldn't Logout. Please try again.",
        variant: "destructive",
      });
    }
  }

  const grouped = useMemo(() => groupServersByType(servers), [servers]);

  return (
    <aside className="sticky top-0 flex h-full md:w-72 flex-col border-r bg-card text-card-foreground">
      <div className="flex-1 overflow-y-auto">
        <div className=" border-b p-2 text-center flex items-center justify-center gap-2">
          <Logo h={12} w={12}/>
          <h1 className="text-3xl text-red-600 font-semibold">Digi Bulletin</h1>
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
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div>
                      <Settings className="h-4 w-4 hover:text-red-500" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={()=>onDeleteServer(srv.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </nav>
      </div>
        <div className="p-4 flex flex-col gap-4 border-t">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-sm text-gray-500">Id - {id}</h1>
              <div className="mb-2 flex items-center gap-2 px-2 py-1 rounded-xl border border-red-500/30 bg-red-500/20 hover:cursor-pointer hover:bg-red-500/40"
                onClick={handleLogout}>
                <h1 className="text-red-600 text-sm font-semibold">Logout</h1>
                <LogOut color="red" size={16}/>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h1>{name?.toUpperCase()}</h1>
              <h1>{usn}</h1>
            </div>
            <div className="flex items-center justify-between text-gray-400">
              <h2 className="text-xs">{type}</h2>
              <h2 className="text-sm">{department} - {semester}{section}</h2>
            </div>
          </div>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-red-600 bg-red-500/60 hover:bg-red-500/30"
            onClick={onCreateServer}
          >
            <Plus className="w-4 h-4" />
            Create Server
          </button>
        </div>

    </aside>
  );
}
