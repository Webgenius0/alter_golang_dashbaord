export function getApiErrorMessage(error: unknown): string {
  if (typeof error === "object" && error && "response" in error) {
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    return apiError.response?.data?.message || "Request failed";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed";
}
