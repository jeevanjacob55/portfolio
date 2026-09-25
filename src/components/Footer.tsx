import { profile } from "../data/profile";

export default function Footer() {
  return (
    <footer className="px-6 sm:px-10 py-8 border-t border-hairline">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p>Built with React, Vite, and Tailwind CSS.</p>
      </div>
    </footer>
  );
}
