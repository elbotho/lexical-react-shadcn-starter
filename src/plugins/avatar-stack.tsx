import { type UserData } from "@/components/editor/utils/use-collaboration";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AvatarStack({ users }: { users: UserData[] }) {
  return (
    <ul className="flex absolute right-3 top-3 space-x-1.5">
      {users.map(({ name, userId, color, emoji }) => {
        return (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <li
                  key={userId}
                  className="text-center text-3xl w-12 h-12 rounded-full pt-1.5"
                  style={{ backgroundColor: color + "77" }}
                >
                  {emoji}
                </li>
              </TooltipTrigger>
              <TooltipContent>
                <p>{name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </ul>
  );
}
