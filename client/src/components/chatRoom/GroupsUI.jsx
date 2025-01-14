import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Plus } from "lucide-react";

export default function GroupsUI() {
  const messages = [
    { id: 1, status: "Unread Message", time: "34m", unread: true },
    { id: 2, status: "Unread Message", time: "34m", unread: true },
    { id: 5, status: "", time: "Yesterday", unread: false },
    { id: 3, status: "Unread Message", time: "34m", unread: true },
    { id: 5, status: "", time: "Yesterday", unread: false },
    { id: 3, status: "Unread Message", time: "34m", unread: true },
    { id: 5, status: "", time: "Yesterday", unread: false },
    { id: 3, status: "Unread Message", time: "34m", unread: true },
    { id: 4, status: "", time: "11:30 PM", unread: false },
    { id: 5, status: "", time: "Yesterday", unread: false },
    { id: 5, status: "", time: "Yesterday", unread: false },
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-background text-foreground">
      <div className="border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <Select>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {messages.map((message, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kmkFNxWCj23YnzpibsQpnr68OUXhFr.png"
                  alt="User avatar"
                />
                <AvatarFallback>LG</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Lois Griffin</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {message.status}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    · {message.time}
                  </span>
                </div>
              </div>
            </div>
            {message.unread && (
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
