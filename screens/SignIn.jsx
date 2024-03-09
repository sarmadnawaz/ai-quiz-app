import React from "react";
import { Alert, View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { Formik } from "formik";
import { signIn } from "../lib/auth.js";
import TextField from "../components/TextField.jsx";
import * as Yup from "yup";
import Link from "../components/Link.jsx";
import ScreenWrapper from "../components/ScreenWrapper.jsx";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required").max(50).min(6),
});

const initialValues = {
  email: "",
  password: "",
};

const SignIn = ({ navigation }) => {
  const handleSubmit = async (values) => {
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScreenWrapper
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isSubmitting,
          errors,
          touched,
        }) => (
          <View style={styles.constainer}>
            <Text style={styles.heading}>Welcome Back</Text>
            <Text style={styles.subHeading}>
              Sign in to continue to your account.
            </Text>
            <View style={styles.fieldsContainer}>
              <TextField
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                label="Email"
                placeholder="Enter your email"
                error={errors.email && touched.email ? errors.email : null}
              />
              <TextField
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                error={
                  errors.password && touched.password ? errors.password : null
                }
              />
            </View>
            <View style={styles.buttomContainer}>
              <Link
                style={{ alignSelf: "center", marginVertical: 10 }}
                navigation={navigation}
                to="SignUp"
              >
                Don't have an account? Sign Up
              </Link>
              <Button width="100%" mode="contained" onPress={handleSubmit}>
                {isSubmitting ? "Signing in..." : "Sign In"}
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

export default SignIn;
