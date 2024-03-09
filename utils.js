import * as FileSystem from "expo-file-system";

export function sortByTimestampPTZ(array, key) {
  try {
    return array.sort((a, b) => {
      const timestampA = new Date(a[key]).getTime();
      const timestampB = new Date(b[key]).getTime();
      return timestampA - timestampB;
    });
  } catch (error) {
    return array;
  }
}

export const fileToBase64 = async (filePath) => {
  try {
    const response = await FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return response;
  } catch (error) {
    console.error("Error converting file to Base64:", error);
    return null;
  }
};
