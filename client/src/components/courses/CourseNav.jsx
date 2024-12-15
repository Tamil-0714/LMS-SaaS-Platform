import React, { useEffect, useState } from "react";
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
const CourseNav = ({ courseMetaData, updateFilter, clearFilter }) => {
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState(false);
  const [orderBy, setOrderBy] = useState(false);
  const [courseCategory, setCourseCategory] = useState([]);

  useEffect(() => {
    let tempArr = [];
    console.log(courseMetaData);
    const uniqueCourseTypes = [
      ...new Set(courseMetaData?.map((course) => course.course_type)),
    ];
    setCourseCategory(uniqueCourseTypes);
  }, [courseMetaData]);
  useEffect(() => {
    console.log("tjis is sort by", sortBy);
  }, [sortBy]);
  const handleApplyFilter = () => {
    setOpen(false);
    if (sortBy === "category") {
      updateFilter("category", "", orderBy);
    } else {
      updateFilter(sortBy, orderBy);
    }
    console.log(sortBy);
    console.log(orderBy);
  };
  const handleSortBy = (e)=>{
    setSortBy(e);
    setOrderBy(false)
  }
  const handleClearFilter = () => {
    setOpen(false);
    setSortBy(false);
    setOrderBy(false);
    clearFilter();
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
                <Select
                  onValueChange={handleSortBy}
                  value={sortBy ? sortBy : undefined}
                  key={sortBy}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Select
                  onValueChange={setOrderBy}
                  value={orderBy ? orderBy : undefined}
                  key={orderBy}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={
                        sortBy === "category" ? "select Category" : "Order By"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {sortBy === "category" ? (
                      <>
                        {courseCategory.map((ele, index) => {
                          return (
                            <>
                              <SelectItem value={ele} key={index}>
                                {ele}
                              </SelectItem>
                            </>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <SelectItem value="ascending">Ascending</SelectItem>
                        <SelectItem value="descending">Descending </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              {!orderBy && !sortBy ? (
                <>
                  <Button onClick={handleApplyFilter}>Apply filter</Button>
                </>
              ) : (
                <>
                  <Button onClick={handleClearFilter}>Clear filter</Button>
                  <Button onClick={handleApplyFilter}>Apply filter</Button>
                </>
              )}
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
