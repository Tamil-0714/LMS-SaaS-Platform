import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CirclePlay } from "lucide-react";
const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);
export const CourseContent = () => {
  return (
    <div>
      <ScrollArea className="h-[480px] w-[640px] rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">
            Course Contents
          </h4>
          {tags.map((tag) => (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <div className="thumnail wrapper">
                    <img
                      style={{
                        width: "80px",
                      }}
                      src={`http://localhost:8020/images/courseThumbnail/09b8bf0345b3258c`}
                      class="img-fluid rounded-top"
                      alt=""
                    />
                  </div>
                  <div className="meta-data-wrapper">
                    <div key={tag} className="text-lg">
                      {tag}
                    </div>
                    <div className="text-sm" style={{
                      color:"#4CAF50"
                    }}>39m 40s</div>
                  </div>
                </div>
                <div
                  className="play"
                  style={{
                    marginRight: "20px",
                    alignSelf: "center",
                  }}
                >
                  <CirclePlay />
                </div>
              </div>
              <Separator className="my-2" />
            </>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
