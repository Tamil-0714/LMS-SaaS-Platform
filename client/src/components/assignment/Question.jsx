import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "@/config";

export default function Question({
  incrementQues,
  currentQuesNo,
  setCurrentQuesNo,
  question,
  maxQuexNo,
}) {
  const [selectedOption, setSelectedOption] = useState("");
  const [submitOk, setSumbitOk] = useState(false);

  // Reset selected option when question changes
  const fetchCurrentQuesAns = async (questionId) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        authorization: localStorage.getItem("authToken"),
      };
      const response = await axios.get(
        `${config.apiBaseUrl}/chosenAns/${questionId}`,
        {
          headers: headers,
        }
      );
      if (response.status === 200) {
        if (response.data.success) {
          setSelectedOption(response.data.data[0].chosed_option);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const insertAns = async (quizId, ans, quizNo) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        authorization: localStorage.getItem("authToken"),
      };
      const response = await axios.post(
        `${config.apiBaseUrl}/insertAns`,
        {
          quizId: quizId,
          chosenOption: ans,
        },
        {
          headers: headers,
        }
      );
      if (response.data.success) {
        incrementQues(quizNo);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (currentQuesNo == maxQuexNo) {
      setSumbitOk(true);
    }
  }, [currentQuesNo]);
  useEffect(() => {
    // console.log("Current question is:", question);
    setSelectedOption(""); // Reset selection when question changes
    fetchCurrentQuesAns(question.quiz_id);
  }, [question]);

  return (
    <div className="bg-black p-6 h-[300px]">
      <div className="mx-auto">
        <h2 className="text-white mb-4 text-sm font-medium">
          {currentQuesNo}. {question.quiz_text}
        </h2>
        <RadioGroup
          className="space-y-3"
          value={selectedOption} // Controlled component
          onValueChange={async (value) => {
            await insertAns(question.quiz_id, value, currentQuesNo);
            setSelectedOption(value);
          }} // Update selected option
        >
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
            <Label htmlFor="d" className="text-sm font-normal text-white">
              {question.option_d}
            </Label>
          </div>
        </RadioGroup>

        <div
          className="btn-grp"
          style={{
            width: "100%",
            height: "70px",
            display: "flex",
            paddingTop: "30px",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Button
            onClick={() => {
              if (currentQuesNo > 1) setCurrentQuesNo(currentQuesNo - 1);
            }}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (currentQuesNo < maxQuexNo)
                setCurrentQuesNo(currentQuesNo + 1);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
