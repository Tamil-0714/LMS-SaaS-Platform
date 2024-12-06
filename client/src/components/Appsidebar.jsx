import {
  Calendar,
  Home,
  Code,
  Inbox,
  GraduationCap,
  Search,
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
      title: "Inbox",
      url: "#",
      icon: Inbox,
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
      title: "Search",
      url: "#",
      icon: Search,
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
                      href={item.url}
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
