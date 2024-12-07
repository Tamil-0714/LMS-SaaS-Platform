import React, { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { useDialog } from "radix-ui/react-dialog";
// import { Label } from "@/components/ui/label";
const CourseNav = () => {
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState(false);
  const [orderBy, setOrderBy] = useState(false);
  const handleApplyFilter = () => {
    setOpen(false);
    console.log(sortBy);
    console.log(orderBy);
  };
  return (
    <div className="course-navBar">
      <div
        className="filter-container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Filter /> Filter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filter Courses</DialogTitle>
              <DialogDescription>
                Click apply to filter out courses.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Select onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="uploadTime">Upload time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Select onValueChange={setOrderBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Order By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ascending">Ascending</SelectItem>
                    <SelectItem value="descending">Descending </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleApplyFilter}>Apply filter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="search-container"></div>
      <div className="right-container"></div>
    </div>
  );
};

export default CourseNav;
