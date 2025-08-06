import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface ColumnActionDropdownProps {
  dropdownLabel: string;
  dataId: string;
}

export default function ColumnActionDropdown({
  dropdownLabel,
  dataId,
}: ColumnActionDropdownProps) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer hover:scale-90 duration-200">
        <Menu />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{dropdownLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.replace(`?action=detail&data-id=${dataId}`)}
        >
          Detail
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.replace(`?action=edit&data-id=${dataId}`)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.replace(`?action=delete&data-id=${dataId}`)}
        >
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
