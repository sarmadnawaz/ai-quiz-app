import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY } from "../config";

const supabaseUrl = "https://svilyhrorsygqyaojbna.supabase.co";

export const supabase = createClient(supabaseUrl, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

const getQuestions = async (quizId) => {
  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz", quizId);

    if (error) {
      throw new Error("Failed to fetch questions");
    }

    return data;
  } catch (error) {
    throw new Error("Failed to fetch questions");
  }
};

const getQuizes = async () => {
  try {
    const { data, error } = await supabase.from("Quiz").select("*");

    if (error) {
      throw new Error("Failed to fetch quizes");
    }

    return data;
  } catch (error) {
    throw new Error("Failed to fetch quizes");
  }
};

const updateQuiz = async ({ quizId, userId, colums }) => {
  try {
    const { error } = await supabase.from("Quiz").update(data).eq("id", quizId);
    if (error) {
      throw new Error("Failed to update quiz");
    }
  } catch (error) {
    throw new Error("Failed to update quiz");
  }
};

const createQuiz = async (input) => {
  try {
    const { data, error } = await supabase
      .from("Quiz")
      .insert([
        {
          title: input.title,
          description: input.description,
          difficulty: input.difficulty,
          time: input.duration,
          attempts: 0,
          totalQuestions: input.totalQuestions,
        },
      ])
      .select("*");
    if (error) {
      throw new Error("Failed to create quiz");
    }
    return data?.[0];
  } catch (error) {
    throw new Error("Failed to create quiz");
  }
};

const addQuestionsToQuiz = async (quizId, questions) => {
  try {
    const { error } = await supabase.from("Question").insert(
      questions?.map((question) => ({
        quiz: quizId,
        description: question.question,
        options: question.options,
        answer: question.answer,
      }))
    );
    if (error) {
      throw new Error("Failed to add questions to quiz");
    }
  } catch (error) {
    throw new Error("Failed to add questions to quiz");
  }
};

const deleteQuiz = async (quizId) => {
  try {
    const { error } = await supabase.from("Quiz").delete().eq("id", quizId);
    if (error) {
      throw new Error("Failed to delete quiz");
    }
  } catch (error) {
    throw new Error("Failed to delete quiz");
  }
};

export {
  getQuestions,
  getQuizes,
  updateQuiz,
  deleteQuiz,
  createQuiz,
  addQuestionsToQuiz,
};
