import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  info: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    info: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, info: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in boundary:", error, errorInfo);
    this.setState({
      info: errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 min-h-screen flex flex-col justify-center items-center">
          <div className="max-w-2xl w-full p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-red-200 dark:border-red-900">
            <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              An unexpected error occurred in the application. Please refresh or contact support if the issue persists.
            </p>
            <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-mono overflow-auto max-h-60 mb-4 whitespace-pre-wrap">
              {this.state.error?.toString()}
            </pre>
            {this.state.info && (
              <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-mono overflow-auto max-h-60 whitespace-pre-wrap text-gray-500">
                {this.state.info.componentStack}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

