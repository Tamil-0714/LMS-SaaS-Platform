import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import bodyParser from "body-parser";
const app = express();


app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));


const genAI = new GoogleGenerativeAI(process.env.GAPI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



const prompt = `Analyze the provided image, which may be a screenshot from a learning platform. The image might contain a mix of programming code and other unrelated text. Your task is to:

1. Focus exclusively on extracting the programming code from the image, ignoring any irrelevant text.
2. Identify the programming language of the extracted code.
3. Return the extracted code as formated directly as output. The first line of the code should include a comment specifying the programming language in the following format:

// Language: <programming language>

If the image does not contain any programming code or the extraction fails, return the following comment as output:

// No valid programming code found in the image.`;

app.post("/proxyImgToCode", async (req, res) => {
  const { mimeType, base64String } = req.body;
  const imagePart = {
    inlineData: {
      data: base64String, // Base64 string of the image
      mimeType: mimeType, // Image MIME type, e.g., "image/png"
    },
  };
  try {
    const result = await model.generateContent([prompt, imagePart]);
    const codeRes = result.response.text();
    return res.send(codeRes)
  } catch (error) {
    console.error("Error while generating content:", error);
  }
  // res.send("ok from proxy");
});


app.listen(3030, () => {
  console.log("AI listening");
});


// const imagePath = path.join(__dirname, "img", "image.png");
// const mimeType = "image/png";

// const imagePart = fileToGenerativePart(imagePath, mimeType);

// function fileToGenerativePart(data, mimeType) {
//   return {
//     inlineData: {
//       data,
//       mimeType,
//     },
//   };
// }

// const prompt = `Analyze the provided image, which may be a screenshot from a learning platform. The image might contain a mix of programming code and other unrelated text. Your task is to:

// 1. Focus exclusively on extracting the programming code from the image, ignoring any irrelevant text.
// 2. Identify the programming language of the extracted code.
// 3. Return the extracted data in the following structured JSON format:

// {
//     "Language": "{programming language of the code}",
//     "Code": "{actual code extracted from the image}"
// }

// If the image does not contain any programming code or the extraction fails, respond with the following JSON structure instead:

// {
//     "Message": "The image provided does not contain valid programming code.",
//     "Result": "Extraction failed."
// }

// Ensure the code includes comments (if present in the image) and verify that the JSON is properly formatted for direct use. Maintain accuracy and clarity in your analysis.`;



// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);