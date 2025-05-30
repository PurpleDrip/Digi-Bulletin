"use client";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { HomeSidebar } from "@/components/home/home-sidebar";
import { ChatPanel } from "@/components/chat/chat-panel"; 
import { axiosInstance } from "@/api/axiosInstance";
import { normalizeServerTree } from "@/lib/normalizeServerTree";
import CreateServer from "@/components/home/CreateServer";
import { set } from "date-fns";

export default function HomeLayout() {
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);
  const [createServerOpen, setcreateServerOpen] = useState(false)

  // Fetch all allowed servers
  const { data: servers = [] } = useQuery({
    queryKey: ["servers"],
    queryFn: async () => {
      const res=await axiosInstance.get("/server/get-server");
      return normalizeServerTree(res.data.servers);
    },
    staleTime: 5 * 60 * 1000,
  });

  // Get owned servers (replace with actual user ID logic)
  const userId = 1; // Replace with real user ID
  const ownedServers = useMemo(
    () => servers.filter((s: any) => s.ownerId === userId),
    [servers, userId]
  );

  // Find the selected server object to pass details
  const selectedServer = useMemo(() => {
    if (!selectedServerId) return null;
    // Flatten servers to find selected server
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
      const res = await fetch(`/api/messages?serverId=${selectedServerId}`, { credentials: "include" });
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

  return (
    <>
      <div className="flex h-screen">
        <HomeSidebar
          servers={servers}
          selectedServerId={selectedServerId}
          onSelectServer={handleSelectServer}
          onEditServer={handleEditServer}
          onCreateServer={handleCreateServer}
          ownedServers={ownedServers}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/40">
            {selectedServerId && selectedServer ? (
              <ChatPanel
                serverId={selectedServerId}
                serverName={selectedServer.name}
                serverAbout={selectedServer.about}
                serverOwnerId={selectedServer.ownerId}
                messages={messages}
                refetchMessages={refetchMessages}
                // Pass socket, user info, etc. as needed
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a server to view messages.
              </div>
            )}
          </main>
        </div>
      </div>
      <CreateServer createServerOpen={createServerOpen} setCreateServerOpen={setcreateServerOpen} ownedServers={ownedServers} />
    </>
  );
}
