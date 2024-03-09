import { Formik } from "formik";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Avatar, Button, Text } from "react-native-paper";
import ScreenWrapper from "../components/ScreenWrapper";
import TextField from "../components/TextField";
import globalStyles from "../styles";
import { useUser } from "../context/UserProvider";
import Modal from "../components/Modal";
import {
  getUserInfo,
  updateUserInfo,
  uploadUserProfile,
} from "../lib/database";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "../lib/auth";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const UpdateProfile = () => {
  const [status, setStatus] = useState("idle");
  const user = useUser();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    getUserInfo(user.id).then((data) => {
      setUserInfo(data);
      setStatus("success");
    });
  }, [user]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setStatus("uploading");
        const uri = result.assets[0].uri;
        // const base64 = await fileToBase64(uri);
        // console.log("res", base64);
        const res = await uploadUserProfile(user.id, uri);
        console.log("res", res);
        setStatus("success");
      }
    } catch (error) {
      console.log("error", error);
      setStatus("success");
    }
  };

  if (status === "idle") {
    return (
      <Modal>
        <ActivityIndicator size="small" />
        <Text>Loading...</Text>
      </Modal>
    );
  }

  if (status === "uploading") {
    return (
      <Modal>
        <ActivityIndicator size="small" />
        <Text>Uploading image...</Text>
      </Modal>
    );
  }

  return (
    <ScreenWrapper style={globalStyles.constainer}>
      <Formik
        initialValues={{
          name: userInfo.full_name,
          email: user?.email,
          password: "",
          imageUri: userInfo.avatar_url,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => updateUserInfo(user?.id, values)}
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
          <View style={styles.container}>
            <Text style={globalStyles.heading}>Update Profile</Text>
            <Text style={globalStyles.subHeading}>
              Update your profile information
            </Text>

            <View marginVertical={20}>
              <Avatar.Text size={100} label={values.name[0]} />
              {/*   {!values?.imageUri ? (
                <Avatar.Image size={100} source={{ uri: values.imageUri }} />
              ) : (
                <Avatar.Text size={100} label={values.name[0]} />
              )} */}
              {/* <Button onPress={pickImage} marginTop={10}>
                Upload profile picture
              </Button> */}
            </View>

            <View style={styles.fieldsContainer}>
              <TextField
                placeholder="Name"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                error={errors.name && touched.name ? errors.name : ""}
              />
              <TextField
                placeholder="Email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                disabled
                value={values.email}
                error={errors.email && touched.email ? errors.email : ""}
              />
              <TextField
                placeholder="Password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry
                error={
                  errors.password && touched.password ? errors.password : ""
                }
              />
            </View>
            <Button
              disabled={isSubmitting}
              marginVertical={40}
              mode="contained"
              onPress={handleSubmit}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </View>
        )}
      </Formik>
      <Button onPress={signOut} mode="outlined" margin={10}>
        Sign out
      </Button>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: "column",
  },
  fieldsContainer: {
    flexDirection: "column",
    gap: 10,
  },
});

export default UpdateProfile;
