function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-3 p-3 rounded-md bg-gray-50 border">
      <div className="text-gray-600">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="font-semibold text-gray-700">{value}</span>
      </div>
    </li>
  );
}


export default SummaryItem