"use client";
import { useState, useMemo, useEffect } from "react";
import { useQuery ,useQueryClient} from "@tanstack/react-query";
import { HomeSidebar } from "@/components/home/home-sidebar";
import { ChatPanel } from "@/components/chat/chat-panel"; 
import { axiosInstance } from "@/api/axiosInstance";
import { normalizeServerTree } from "@/lib/normalizeServerTree";
import CreateServer from "@/components/home/CreateServer";
import { SocketProvider } from "@/context/SocketContext";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { deleteServer } from "@/api/server";
import { useToast } from "@/hooks/use-toast";

export default function HomeLayout() {
  const {toast}=useToast();
  const queryClient = useQueryClient();

  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [createServerOpen, setcreateServerOpen] = useState(false)

  const [userUSN, setUserUSN] = useState<string | undefined>(undefined);

  const userUSNfromStore = useSelector((state: RootState) => state.user.usn);

  useEffect(() => {
    if (userUSNfromStore !== null && userUSNfromStore !== undefined) {
      setUserUSN(userUSNfromStore);
    }
  }, [userUSNfromStore]);

  console.log("User ID from Redux:", userUSN);

  // Fetch all allowed servers
  const { data: servers = [] } = useQuery({
    queryKey: ["servers"],
    queryFn: async () => {
      const res=await axiosInstance.get("/server/get-server");
      return normalizeServerTree(res.data.servers);
    },
    staleTime: 5 * 60 * 1000,
  });

  const {data:ownedServersData=[]}=useQuery({
    queryKey: ["ownedServers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/server/get-owned-servers");
      console.log("Owned Servers Data:", res.data);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  })

  const selectedServer = useMemo(() => {
    if (!selectedServerId) return null;
    const flatten = (nodes: any[]): any[] => {
      let result: any[] = [];
      nodes.forEach((node) => {
        result.push(node);
        if (node.childServers) {
          result = result.concat(flatten(node.childServers));
        }
      });
      return result;
    };
    const flatServers = flatten(servers);
    return flatServers.find((srv) => srv.id === selectedServerId) || null;
  }, [selectedServerId, servers]);

  // Fetch messages for the selected server
  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ["messages", selectedServerId],
    queryFn: async () => {
      if (!selectedServerId) return [];
      const res = await fetch(`http://15.207.20.226:3000/api/messages/get-messages?serverId=${selectedServerId}`, { credentials: "include" });
      const json = await res.json();
      return json.messages;
    },
    enabled: !!selectedServerId, // only fetch when a server is selected
  });

  // Handler for server selection
  const handleSelectServer = (serverId: number) => {
    setSelectedServerId(serverId);
    // Optionally: join Socket.IO room here
  };

  // Handler for create/edit server
  const handleCreateServer = () => {
    setcreateServerOpen(true);
  };
  const handleEditServer = (serverId: number) => {
    // open modal or navigate to edit server page
  };
  const handleDelete=async (serverId:number)=>{
    if(!serverId)return;

    console.log("Type at front",typeof serverId)
    try{
      const res=await deleteServer(serverId)

      if(res.data.success){
        toast({
          title: "Server Deleted.",
          description: `Server ID ${serverId} deleted Successfully.`,
        });

        queryClient.invalidateQueries({ queryKey: ["servers"] });
        queryClient.invalidateQueries({ queryKey: ["ownedServers"] });
      }
    }catch(err){
      console.log(err)
        toast({
          title: "Server Deletion Failed.",
          description: `Couldnt Delete the server with ID ${serverId}.`,
          variant: "destructive",
        });
    }
  }

  return (
    <SocketProvider>
      <div className="flex h-screen">
        <HomeSidebar
          servers={servers}
          selectedServerId={selectedServerId}
          onSelectServer={handleSelectServer}
          onEditServer={handleEditServer}
          onCreateServer={handleCreateServer}
          ownedServers={ownedServersData}
          onDeleteServer={handleDelete}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-2 bg-muted/40">
            {selectedServerId && selectedServer ? (
              <ChatPanel
                serverId={selectedServerId}
                serverName={selectedServer.name}
                serverAbout={selectedServer.about}
                serverType={selectedServer.type}
                serverOwnerId={selectedServer.ownerId}
                userUSN={userUSN}
                allowAnonymous={selectedServer.allowAnonymous ?? false}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a server to view messages.
              </div>
            )}
          </main>
        </div>
      </div>
      <CreateServer createServerOpen={createServerOpen} setCreateServerOpen={setcreateServerOpen} ownedServers={ownedServersData} />
    </SocketProvider>
  );
}
