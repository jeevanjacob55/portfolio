interface SectionHeadingProps {
  index: string;
  title: string;
  description?: string;
  id?: string;
  hideEyebrow?: boolean;
}

export default function SectionHeading({ index, title, description, id, hideEyebrow = false }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      {!hideEyebrow && (
        <p className="section-heading__eyebrow">
          <span>{index}</span> / {title}
        </p>
      )}
      <h2 id={id} className="section-heading__title">{title}</h2>
      {description && <p className="section-heading__description">{description}</p>}
    </header>
  );
}
