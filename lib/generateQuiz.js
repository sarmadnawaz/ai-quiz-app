import { OPENAI_API_KEY } from "../config";
import visionai from "./visionai";

const getPrompt = ({
  images = [],
  description = "",
  difficulty = "easy",
  duration = 1,
}) => `
    Imagine you are a teacher and you are creating a quiz for your students.
    You have to generate a quiz based on the following description enclosed in first +++ and +++ last.

    +++
    ${images.join(" ")}
    Important: ${description}
    +++

    The quiz would be multiple choice questions.

    Return Values Instructions:
    return a json array of objects, where each object has the following keys:
    - question: string
    - options: array of strings
    - answer: string

    The difficulty of the questions should be ${difficulty}. and there should be ${
  duration * 2
} questions in the quiz.
    Remeber to return only valid json.

`;

async function generateTextContentFromImage(images = []) {
  try {
    const imagesText = await Promise.all(
      images.map(async (image) => {
        const text = await visionai.callGoogleVisionAsync(image);
        return text || "";
      })
    );

    return imagesText.join(" ");
  } catch (error) {
    throw new Error("Failed to generate text content from image");
  }
}

function generateQuiz({ images, description, difficulty, duration }) {
  try {
    const imagesContent = generateTextContentFromImage(images);
    const prompt = getPrompt({
      imagesContent,
      description,
      difficulty,
      duration,
    });
    const quizContent = getChatCompletion(prompt);
    console.log(quizContent);
    return quizContent;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to generate quiz");
  }
}

async function getChatCompletion(prompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.log(response.status, response.statusText);
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();

    const responseContent = responseData?.choices?.[0]?.message?.content;
    return responseContent;
  } catch (error) {
    return { error: error.message };
  }
}

export default generateQuiz;
