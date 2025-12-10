export type SubjectName = "Football" | string;

export interface RssSource {
  name: string;
  url: string;
  sujetName: SubjectName;
}

// Organize sources by subject for clarity and better management
export const RSS_SOURCES: RssSource[] = [
  // --- FOOTBALL ---
  {
    name: "L'Equipe",
    url: "https://dwh.lequipe.fr/api/edito/rss?path=/Football/",
    sujetName: "Football",
  },
  {
    name: "RMC Sport",
    url: "https://rmcsport.bfmtv.com/rss/football/",
    sujetName: "Football",
  },
  {
    name: "BBC Football",
    url: "http://feeds.bbci.co.uk/sport/football/rss.xml",
    sujetName: "Football",
  },
  {
    name: "The Guardian",
    url: "https://www.theguardian.com/football/rss",
    sujetName: "Football",
  },
  {
    name: "Sky Sports",
    url: "https://www.skysports.com/rss/12040",
    sujetName: "Football",
  },
  {
    name: "Marca",
    url: "https://e00-marca.uecdn.es/rss/futbol.xml",
    sujetName: "Football",
  },
  {
    name: "AS",
    url: "https://as.com/rss/futbol.xml",
    sujetName: "Football",
  },
  {
    name: "La Gazzetta dello Sport",
    url: "https://www.gazzetta.it/rss/calcio.xml",
    sujetName: "Football",
  },
  {
    name: "Corriere dello Sport",
    url: "https://www.corrieredellosport.it/rss/calcio",
    sujetName: "Football",
  },
  {
    name: "Kicker",
    url: "https://rss.kicker.de/news/fussball",
    sujetName: "Football",
  },
  // --- ADD NEW SUBJECTS HERE ---
  // Example:
  // {
  //   name: "TechCrunch",
  //   url: "...",
  //   sujetName: "Tech"
  // }
];
