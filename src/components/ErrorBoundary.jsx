import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7] px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-[#3B4759] mb-4">
              Une erreur est survenue
            </h1>
            <p className="text-[#6B7A94] mb-6">
              L'application a rencontré un problème inattendu. Veuillez recharger la page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#FF6B4A] text-white rounded-lg font-medium hover:bg-[#e55a3a] transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
