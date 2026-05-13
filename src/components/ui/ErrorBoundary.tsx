import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="text-center space-y-4">
              <p className="text-4xl">⚠️</p>
              <h2 className="text-xl font-bold text-white">Qualcosa è andato storto</h2>
              <p className="text-white/40 text-sm max-w-xs">
                {this.state.error?.message ?? 'Errore imprevisto'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-white/60 underline"
              >
                Ricarica la pagina
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
