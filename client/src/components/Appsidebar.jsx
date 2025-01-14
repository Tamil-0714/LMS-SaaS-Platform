import {
  Calendar,
  Home,
  Code,
  LibraryBig,
  GraduationCap,
  MessageCircleMore,
  UserRoundPen,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.

export function AppSidebar({
  changeToCodeEditor,
  changeToHome,
  changeToCourse,
  changeToChatRoom,
}) {
  const items = [
    {
      title: "Home",
      url: "#",
      icon: Home,
      clickerFunction: changeToHome,
    },
    {
      title: "Courses",
      url: "#",
      icon: GraduationCap,
      clickerFunction: changeToCourse,
    },
    {
      title: "My Courses",
      url: "#",
      icon: LibraryBig,
    },
    {
      title: "Notes and Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Code PlayGround",
      url: "#",
      icon: Code,
      clickerFunction: changeToCodeEditor,
    },
    {
      title: "Chat Room",
      url: "#",
      icon: MessageCircleMore,
      clickerFunction: changeToChatRoom,
    },
    {
      title: "Profile",
      url: "#",
      icon: UserRoundPen,
    },
  ];
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>E - Learnign Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      // href={item.url}
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={
                        item.clickerFunction ? item.clickerFunction : undefined
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
