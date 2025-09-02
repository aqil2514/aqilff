import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof Input> & {
  label: string;
  wrapperClassName?: string;
};

export function LabeledInput({ label, id, wrapperClassName, ...rest }: Props) {
  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...rest} />
    </div>
  );
}
