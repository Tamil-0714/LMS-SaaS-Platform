import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function QuestionNumbers({
  count,
  currentQuesNo,
  answeredQues,
  setCurrentQuesNo,
}) {
  // Create an array of numbers from 1 to 30
  const numbers = Array.from({ length: count }, (_, i) => i + 1);
  useEffect(() => {
    console.log("changing : ", currentQuesNo);
  }, [currentQuesNo]);

  return (
    <div
      className="w-[1200px] mx-auto p-6 "
      style={{
        border: "1px solid white",
        borderRadius: "12px",
        marginTop: "30px",
      }}
    >
      <div
        className="question-head"
        style={{
          marginBottom: "20px",
        }}
      >
        <h4 className="scroll-m-20 text-xl text-center font-semibold tracking-tight">
          Navigate to questions
        </h4>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {numbers.map((number) => {
          let style = { cursor: "pointer" }; // Default style

          if (currentQuesNo === number) {
            style = { ...style, backgroundColor: "#626262" }; // Merge styles
          }
          if (answeredQues.includes(number)) {
            style = { ...style, backgroundColor: "#4caf50" }; // Overwrites only backgroundColor
          }
          return (
            <Card
              onClick={() => {
                setCurrentQuesNo(number);
                // incrementQues();
              }}
              key={number}
              className="transition-all hover:scale-105 w-[60px]"
              style={style}
            >
              <CardContent className="flex items-center justify-center p-2 ">
                <span className="text-xl font-bold">{number}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
