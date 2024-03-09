import { supabase } from "./database";
import { AppState } from "react-native";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export const signUp = async (email, password) => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) throw new Error(error.message);

    return session;
  } catch (error) {
    throw new Error("Error siging up: " + error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    throw new Error("Error siging in: " + error.message);
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw new Error(error.message);
  } catch (error) {
    throw new Error("Error siging out: " + error.message);
  }
};
