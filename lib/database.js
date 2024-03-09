import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY } from "../config";
import { sortByTimestampPTZ } from "../utils";

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

const getQuizes = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("Quiz")
      .select("*")
      .eq("user", userId);

    if (error) {
      throw new Error("Failed to fetch quizes");
    }

    return sortByTimestampPTZ(data, "created_at");
  } catch (error) {
    throw new Error("Failed to fetch quizes");
  }
};

const updateQuiz = async (quiz) => {
  try {
    const { error } = await supabase
      .from("Quiz")
      .update([
        {
          attempts: quiz.attempts + 1,
          score: Number(quiz.score || 0),
          status: "attempted",
        },
      ])
      .eq("id", quiz.id);
    if (error) {
      throw new Error("Failed to update quiz");
    }

    return;
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
          attempts: 0,
          totalQuestions: input.totalQuestions,
          user: input.user,
          status: "unattempted",
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

const getUserInfo = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId);
    if (error) {
      console.log(error);
      throw new Error("Failed to fetch user info");
    }
    return data?.[0];
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch user info");
  }
};

const updateUserInfo = async (userId, data) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: data.name })
      .eq("id", userId);

    if (data?.password) {
      await supabase.auth.updateUser({
        email: data.email,
        password: data.password,
      });
    }

    if (error) {
      throw new Error("Failed to update user info");
    }
  } catch (error) {
    throw new Error("Failed to update user info");
  }
};

const uploadUserProfile = async (id, file) => {
  try {
    const response = await fetch(file);
    const blob = await response.blob();

    console.log(blob);

    const { data, error } = await supabase.storage
      .from("user_avatars")
      .upload(`private/${id}`, blob);

    console.log(data, error);

    if (error) {
      throw new Error("Failed to upload profile picture");
    }

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upload profile picture");
  }
};

const getQuiz = async (quizId) => {
  try {
    // get quiz
    const { data: quiz, error } = await supabase
      .from("Quiz")
      .select("*")
      .eq("id", quizId);
    if (error) {
      throw new Error("Failed to fetch quiz");
    }

    // get questions
    const { data: questions, error: questionsError } = await supabase
      .from("Question")
      .select("*")
      .eq("quiz", quizId);
    if (questionsError) {
      throw new Error("Failed to fetch questions");
    }

    return {
      ...quiz?.[0],
      questions,
    };
  } catch (error) {
    throw new Error("Failed to fetch quiz");
  }
};

export {
  getQuestions,
  getQuizes,
  updateQuiz,
  deleteQuiz,
  createQuiz,
  addQuestionsToQuiz,
  getQuiz,
  getUserInfo,
  updateUserInfo,
  uploadUserProfile,
};
