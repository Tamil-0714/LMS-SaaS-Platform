import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export default function Question({
  incrementQues,
  currentQuesNo,
  setCurrentQuesNo,
  question,
}) {
  useEffect(() => {
    console.log("current quetion is : ", question);
  }, [question]);
  const quesobjRef = {
    "quiz_id": "a1b2c3d4e5f6g7h8",
    "course_id": "38c4917849ba6abe",
    "quiz_text": "What is React primarily used for?",
    "option_a": "Building databases",
    "option_b": "Creating mobile apps",
    "option_c": "Developing user interfaces",
    "option_d": "Managing servers",
    "correct_option": "C"
}
  return (
    <div className="bg-black p-6 h-[300px]">
      <div className="mx-auto">
        <h2 className="text-white mb-4 text-sm font-medium">
          {currentQuesNo}. {question.quiz_text}
        </h2>
        <RadioGroup className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="a"
              id="a"
              className="border-white text-white"
            />
            <Label htmlFor="a" className="text-sm font-normal text-white">
              {question.option_a}
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="b"
              id="b"
              className="border-white text-white"
            />
            <Label htmlFor="b" className="text-sm font-normal text-white">
              {question.option_b}
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="c"
              id="c"
              className="border-white text-white"
            />
            <Label htmlFor="c" className="text-sm font-normal text-white">
              {question.option_c}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="d"
              id="d"
              className="border-white text-white"
            />
            <Label
              htmlFor="d"
              className="text-sm font-normal text-white"
            >
             {question.option_d}
            </Label>
          </div>
        </RadioGroup>
        <div
          className="btn-grp"
          style={{
            width: "100%",
            // outline:"1px solid red",
            height: "70px",
            display: "flex",
            paddingTop: "30px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => {
              if (currentQuesNo > 1) setCurrentQuesNo(currentQuesNo - 1);
              // incrementQues();
            }}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (currentQuesNo < 30) setCurrentQuesNo(currentQuesNo + 1);
              // incrementQues();
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
