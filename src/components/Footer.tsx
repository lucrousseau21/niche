export default function Footer() {
  return (
    <footer className="mt-8 text-xs small-muted">
      <div className="flex items-center justify-between">
        <div>© {new Date().getFullYear()} Niche. Tous droits réservés.</div>
        <div className="flex gap-4">
          <a href="#" className="small-muted">Politique de confidentialité</a>
          <a href="#" className="small-muted">CGU</a>
        </div>
      </div>
    </footer>
  );
}