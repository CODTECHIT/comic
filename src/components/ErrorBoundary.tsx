import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4EFE0] flex items-center justify-center p-6">
          <div className="bg-white border-4 border-black p-8 max-w-md w-full text-center" style={{ boxShadow: "8px 8px 0 #C8181E" }}>
            <AlertTriangle size={64} className="mx-auto text-[#C8181E] mb-6" />
            <h1 style={{ fontFamily: "Bangers, cursive", fontSize: "36px", letterSpacing: "0.05em" }} className="mb-4">
              SOMETHING WENT WRONG!
            </h1>
            <p className="text-[#6B5B45] mb-8 font-medium">
              Something went wrong. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#1A4FCC] text-white py-3 font-bold border-2 border-black hover:bg-[#0D0D0D] transition-colors cursor-pointer"
              style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.05em" }}
            >
              REFRESH PAGE
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
