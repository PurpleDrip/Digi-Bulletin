export function ParentServerDropdown({ ownedServers, value, onChange }:{
    ownedServers: { id: string; name: string }[];
    value: string;
    onChange: (value: string) => void;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Parent Server</label>
      <select
        className="w-full border rounded px-2 py-1"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">None</option>
        {ownedServers.map((srv) => (
          <option key={srv.id} value={srv.id}>{srv.name}</option>
        ))}
      </select>
    </div>
  );
}
