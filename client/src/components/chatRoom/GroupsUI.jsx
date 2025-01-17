import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import config from "@/config";
import axios from "axios";
import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function GroupsUI({
  globeEnrolledCourses,
  setCurrentGroup,
  joinGroup,
}) {
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

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    setEnrolledCourses(globeEnrolledCourses);
    setSelectedCourse(globeEnrolledCourses[0]?.course_id);
    console.log("enrolments on gropus ui: ", enrolledCourses);
  }, [globeEnrolledCourses]);
  const fetchGroups = async (courseId) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("authToken"),
      };
      const response = await axios.get(
        `${config.apiBaseUrl}/groups/${courseId}`,
        { headers: headers }
      );
      if (response.status === 200 && response.data.success) {
        console.log(response.data.data);

        setGroups(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (selectedCourse) {
      fetchGroups(selectedCourse);
    }
  }, [selectedCourse]);
  useEffect(() => {
    console.log("on finla : ", enrolledCourses);
  }, [enrolledCourses]);

  return (
    <div className="w-full max-w-md mx-auto bg-background text-foreground">
      <div className="border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Courses" />
            </SelectTrigger>
            <SelectContent>
              {enrolledCourses.map((course, index) => (
                <SelectItem value={course.course_id}>
                  {course.course_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {/* [
    {
        "chatroom_id": "c01f14eaa5f23df0",
        "course_id": "0afc64d55106a723",
        "chatRoom_name": "ML-Starters",
        "create_at": "2025-01-16T13:07:05.000Z"
    }
] */}
        {groups.map((group, index) => (
          <div
            key={group.chatroom_id}
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              joinGroup(group.chatroom_id);
              setCurrentGroup(group.chatroom_id);
            }}
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
                <h3 className="font-semibold">{group.chatRoom_name}</h3>
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm text-muted-foreground"
                    style={{
                      color: "orange",
                    }}
                  >
                    {group.unread ? "Unread Message" : ""}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    · {group.unread ? group.timestamp : ""}
                  </span>
                </div>
              </div>
            </div>
            {group.unread && (
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            )}
            {/* {group.unread && (
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
}
