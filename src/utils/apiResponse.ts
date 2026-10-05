export const apiResponse = <T>(
  message: string,
  data?: T,
) => {
  return {
    success: true,
    message,
    data,
  }
};
