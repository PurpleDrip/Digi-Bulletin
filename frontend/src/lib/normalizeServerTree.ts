export function normalizeServerTree(servers:any) {
  const map: { [key: string]: any } = {};
  servers.forEach((s:any) => (map[s.id] = { ...s, childServers: [] }));
  const roots = [] as any[];
  servers.forEach((s: any) => {
    if (s.parentId && map[s.parentId]) {
      map[s.parentId].childServers.push(map[s.id]);
    } else {
      roots.push(map[s.id]);
    }
  });
  console.log("Normalized server tree:", roots);
  return roots;
}
