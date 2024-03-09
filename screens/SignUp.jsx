import React from "react";
import { View, Alert, StyleSheet } from "react-native";
import TextField from "../components/TextField.jsx";
import { Text, Button } from "react-native-paper";
import { Formik } from "formik";
import Link from "../components/Link.jsx";
import ScreenWrapper from "../components/ScreenWrapper.jsx";
import { signUp } from "../lib/auth.js";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required").max(50).min(6),
});

const initialValues = {
  email: "",
  password: "",
};

const SignUp = ({ navigation }) => {
  const handleSubmit = async (values) => {
    try {
      const session = await signUp(values.email, values.password);
      if (!session)
        Alert.alert(
          "Email Verification",
          "Please verify your email to continue. Check your email for the verification link."
        );
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    return;
  };

  return (
    <ScreenWrapper
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isSubmitting,
          errors,
        }) => (
          <View style={styles.constainer}>
            <Text style={styles.heading}>Get Started</Text>
            <Text style={styles.subHeading}>
              Sign up to get started with your account.
            </Text>
            <View style={{ marginTop: 20, flexDirection: "column", gap: 5 }}>
              <TextField
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                label="Email"
                placeholder="Enter your email"
                error={errors?.email}
              />
              <TextField
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                error={errors?.password}
              />
            </View>

            <View style={styles.buttomContainer}>
              <Link
                style={{ alignSelf: "center", marginVertical: 10 }}
                navigation={navigation}
                to="SignIn"
              >
                Already signed up? Sign In
              </Link>
              <Button width="100%" mode="contained" onPress={handleSubmit}>
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontWeight: "700",
    fontSize: 24,
    marginVertical: 5,
  },
  subHeading: {
    fontSize: 18,
  },
  fieldsContainer: {
    marginVertical: 20,
    gap: 10,
  },
  buttomContainer: {
    marginTop: "auto",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
});

export default SignUp;
