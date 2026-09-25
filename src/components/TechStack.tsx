import { skills } from "../data/skills";

const dotColors = ["bg-mint", "bg-teal", "bg-emerald", "bg-mint"];

export default function TechStack() {
  return (
    <section id="stack" className="py-24 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-heading font-semibold text-3xl text-ink text-center mb-14">Technical Stack</h2>

        <div className="grid sm:grid-cols-2 gap-5">
          {skills.map((group, i) => (
            <div key={group.category} className="gradient-card rounded-2xl border border-hairline p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-1.5 h-1.5 rounded-full ${dotColors[i % dotColors.length]}`} />
                <h3 className="text-sm text-bg font-medium">{group.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-emerald/20 text-emerald hover:border-teal/50 hover:text-teal transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
