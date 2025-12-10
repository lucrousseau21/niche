export default function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon?: React.ReactNode }) {
  return (
    <div className="card flex items-start gap-4">
      <div className="w-12 h-12 rounded-lg" style={{ background: 'var(--color-mint)', display:'grid', placeItems:'center', fontSize:18 }}>
        {icon ?? '✨'}
      </div>
      <div>
        <div className="font-semibold title-font">{title}</div>
        <div className="small-muted mt-1">{desc}</div>
      </div>
    </div>
  );
}