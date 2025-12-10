export default function NewsletterCard({ category, date, title, bullets }: { category: string; date: string; title: string; bullets: string[] }) {
  return (
    <article className="card">
      <div className="flex items-center justify-between">
        <div className="text-sm small-muted">{category}</div>
        <div className="text-xs small-muted">{date}</div>
      </div>
      <h4 className="font-semibold title-font mt-3">{title}</h4>
      <ul className="mt-2 small-muted list-disc pl-5 space-y-1">
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
      <div className="mt-3 small-muted flex justify-between">
        <div>5 min de lecture</div>
        <a className="text-[var(--color-forest)]" href="#">Lire la suite →</a>
      </div>
    </article>
  );
}