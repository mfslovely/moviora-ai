export type Movie = {
  id: string;
  title: string;
  year: string;
  rating: string;
  runtime: string;
  genres: string[];
  cast: string[];
  poster: string;
  backdrop: string;
  overview: string;
  audienceSignal: string;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
};

export const movies: Movie[] = [
  {
    id: "interstellar",
    title: "Interstellar",
    year: "2014",
    rating: "8.7",
    runtime: "2h 49m",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    cast: ["Matthew McConaughey as Cooper", "Anne Hathaway as Brand", "Jessica Chastain as Murph"],
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    overview:
      "A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.",
    audienceSignal:
      "Viewers praise the emotional father-daughter core, practical spectacle, and ambitious science ideas.",
    sentiment: { positive: 72, neutral: 18, negative: 10 }
  },
  {
    id: "dune-part-two",
    title: "Dune: Part Two",
    year: "2024",
    rating: "8.5",
    runtime: "2h 47m",
    genres: ["Sci-Fi", "Epic", "Action"],
    cast: ["Timothee Chalamet as Paul Atreides", "Zendaya as Chani", "Rebecca Ferguson as Lady Jessica"],
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    overview:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    audienceSignal:
      "Reviews highlight scale, sound design, political tension, and the darker evolution of Paul.",
    sentiment: { positive: 81, neutral: 12, negative: 7 }
  },
  {
    id: "arrival",
    title: "Arrival",
    year: "2016",
    rating: "7.9",
    runtime: "1h 56m",
    genres: ["Sci-Fi", "Mystery", "Drama"],
    cast: ["Amy Adams as Louise Banks", "Jeremy Renner as Ian Donnelly", "Forest Whitaker as Colonel Weber"],
    poster: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/yIZ1xendyqKvY3FGeeUYUd5X9Mm.jpg",
    overview:
      "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
    audienceSignal:
      "People love its quiet tone, language-first premise, and emotionally precise ending.",
    sentiment: { positive: 76, neutral: 17, negative: 7 }
  },
  {
    id: "kabhi-khushi-kabhie-gham",
    title: "Kabhi Khushi Kabhie Gham",
    year: "2001",
    rating: "7.4",
    runtime: "3h 30m",
    genres: ["Drama", "Family", "Romance"],
    cast: ["Shah Rukh Khan as Rahul", "Kajol as Anjali", "Amitabh Bachchan as Yash", "Hrithik Roshan as Rohan", "Kareena Kapoor as Poo"],
    poster: "https://m.media-amazon.com/images/M/MV5BN2MyZGVhNmMtY2JkNy00ZmIzLTkwOGItY2NiM2MyOGMxODkzXkEyXkFqcGc@._V1_SX300.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    overview:
      "A wealthy family is divided by love, pride, and tradition when the elder son marries against his father's wishes.",
    audienceSignal:
      "Viewers remember the family emotion, music, scale, iconic performances, and nostalgic rewatch value.",
    sentiment: { positive: 78, neutral: 14, negative: 8 }
  }
];

export const assistantPrompts = [
  "Compare Interstellar and Arrival emotionally.",
  "Suggest cerebral sci-fi with strong human drama.",
  "What did audiences dislike about Dune: Part Two?",
  "Find movies about time, grief, and sacrifice."
];


