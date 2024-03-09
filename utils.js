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
