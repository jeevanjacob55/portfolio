export default function AnimatedBackground() {
  return (
    <>
      <div className="blob-stage" aria-hidden="true">
        <div className="blob blob--1" />
        <div className="blob blob--2" />
        <div className="blob blob--3" />
        <div className="blob blob--4" />
        <div className="blob blob--5" />
      </div>
      <div className="blob-grain" aria-hidden="true" />
    </>
  );
}
