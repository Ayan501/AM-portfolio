import { Component, Suspense, lazy, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from "react";

const NeuralCanvas = lazy(() => import("./NeuralCanvas"));

class VisualBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Neural visual could not be rendered.", error, info);
  }

  render() {
    if (this.state.failed) return <div className="neural-fallback" aria-hidden="true" />;
    return this.props.children;
  }
}

export function NeuralVisual() {
  const visual = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = visual.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={visual} className="neural-visual" role="img" aria-label="Abstract three-dimensional neural network visual">
      {inView ? (
        <VisualBoundary>
          <Suspense fallback={<div className="neural-fallback" aria-hidden="true" />}>
            <NeuralCanvas />
          </Suspense>
        </VisualBoundary>
      ) : (
        <div className="neural-fallback" aria-hidden="true" />
      )}
      <span className="visual-caption">LEARNING SYSTEMS · 01</span>
    </div>
  );
}
