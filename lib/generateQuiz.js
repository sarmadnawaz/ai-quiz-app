import { OPENAI_API_KEY } from "../config";
import { callGoogleVisionAsync } from "./visionai";

const getPrompt = ({
  imagesContent = "",
  description = "",
  difficulty = "easy",
  duration = 1,
}) => `
    Imagine you are a teacher and you are creating a quiz for your students.
    You have to generate a quiz based on the following description enclosed in first +++ and +++ last.

    +++
    ${imagesContent}
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
    if(images.length === 0) return "";
    const imagesText = await Promise.all(
      images.map(async (image) => {
        const text = await callGoogleVisionAsync(image);
        return text || "";
      })
    );

    return imagesText.join(" ");
  } catch (error) {
    throw new Error("Failed to generate text content from image");
  }
}

async function generateQuiz({ images, description, difficulty, duration }) {
  try {
    const imagesContent = await generateTextContentFromImage(images);
    const prompt = getPrompt({
      imagesContent,
      description,
      difficulty,
      duration,
    });
    console.log("Prompt:", prompt);
    const quizContent = await getChatCompletion(prompt);
    console.log("Quiz Content:", quizContent);
    return quizContent;
  } catch (error) {
    throw new Error("Failed to generate quiz");
  }
}

const parseQuizContent = (quizContent) => {
  try {
    quizContent = quizContent?.trim();
    if (quizContent.includes("```json"))
      quizContent = quizContent.replace("```json", "");
    if (quizContent.includes("```"))
      quizContent = quizContent.replace("```", "");
    const questions = JSON.parse(quizContent);
    return questions;
  } catch (error) {
    throw new Error("Failed to parse quiz content");
  }
};

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
    return parseQuizContent(responseContent);
  } catch (error) {
    return { error: error.message };
  }
}

export default generateQuiz;
