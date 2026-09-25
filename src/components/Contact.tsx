import { FormEvent, useState } from "react";
import { Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { profile } from "../data/profile";

// GitHub Pages is static hosting with no backend. Set VITE_FORM_ENDPOINT
// (e.g. a Formspree/Getform endpoint) in a .env file to submit messages
// for real. Without it, the form falls back to opening the visitor's
// email client with the message pre-filled — it never claims to have
// sent something it didn't.
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Enter a valid email.";
    if (!values.message.trim()) next.message = "Message can't be empty.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!FORM_ENDPOINT) {
      // No backend configured — be honest about it and hand off to email.
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
        `Message from ${values.name}`
      )}&body=${encodeURIComponent(values.message)}`;
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display font-semibold text-3xl text-ink text-center mb-14">Get in touch</h2>
        <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-muted leading-relaxed mb-8 max-w-sm">
            Open to full-stack and backend engineering roles, freelance work, and interesting
            problems. Reach out and I'll get back to you.
          </p>

          <div className="space-y-3.5 text-sm">
            <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-muted hover:text-ink transition-colors">
              <Mail size={16} /> {profile.email}
            </a>
            <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted hover:text-ink transition-colors">
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href={profile.social.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-muted hover:text-ink transition-colors">
              <Github size={16} /> GitHub
            </a>
            <p className="flex items-center gap-3 text-muted">
              <MapPin size={16} /> {profile.location}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-muted mb-1.5">Name</label>
            <input
              id="name"
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              className="w-full rounded-lg bg-white/5 border border-hairline px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-mint/50 outline-none transition-colors"
              placeholder="Your name"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-muted mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              className="w-full rounded-lg bg-white/5 border border-hairline px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-mint/50 outline-none transition-colors"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm text-muted mb-1.5">Message</label>
            <textarea
              id="message"
              rows={4}
              value={values.message}
              onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
              className="w-full rounded-lg bg-white/5 border border-hairline px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-mint/50 outline-none transition-colors resize-none"
              placeholder="What would you like to say?"
            />
            {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-mint text-[#050A08] font-medium text-sm py-2.5 hover:bg-mint/90 transition-colors disabled:opacity-60"
          >
            <Send size={15} />
            {status === "loading" ? "Sending…" : "Send message"}
          </button>

          {status === "success" && (
            <p className="text-sm text-mint">Thanks — your message is on its way.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400">Something went wrong. Please try again or email directly.</p>
          )}
          {!FORM_ENDPOINT && (
            <p className="text-xs text-muted/70">
              This form opens your email client — connect a form service (e.g. Formspree) via
              VITE_FORM_ENDPOINT to send messages directly.
            </p>
          )}
        </form>
        </div>
      </div>
    </section>
  );
}
