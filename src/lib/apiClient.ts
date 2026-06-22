export class ApiError extends Error {
  status?: number;
  isTimeout?: boolean;
  constructor(message: string, status?: number, isTimeout = false) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.isTimeout = isTimeout;
  }
}

export const fetchApi = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000); // 10 seconds

  // If the user already provided a signal, we can't easily merge them in older browsers, 
  // but let's assume they don't, or we override with our timeout unless they specifically provided one.
  const signal = options.signal || controller.signal;

  try {
    const response = await fetch(url, {
      ...options,
      signal,
    });
    
    clearTimeout(id);

    if (!response.ok) {
      if (response.status >= 500) {
        try {
          const errData = await response.clone().json();
          throw new ApiError(errData.message + (errData.error ? ": " + errData.error : ""), response.status);
        } catch(e) {
          throw new ApiError("We're temporarily unable to load the content. Please try again in a few minutes.", response.status);
        }
      }
      // For 400s and 401s, we return the response so the calling code can parse the JSON error message
    }
    
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new ApiError("This is taking longer than expected. Please try again.", undefined, true);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors (like server dead, dns resolution failed)
    throw new ApiError("We're temporarily unable to load the content. Please try again in a few minutes.");
  }
};
