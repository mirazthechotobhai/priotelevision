export type FallbackMedia = {
  id: string;
  title: string;
  poster: string;
  overview: string;
  year: string;
  rating: number;
  genre: string;
  type: 'movie' | 'tv';
};

const poster = (path: string) => `https://image.tmdb.org/t/p/w500${path}`;

export const fallbackMedia: FallbackMedia[] = [
  { id: '872585', title: 'Oppenheimer', poster: poster('/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'), overview: 'The story of J. Robert Oppenheimer and the development of the atomic bomb.', year: '2023', rating: 8.1, genre: 'Drama', type: 'movie' },
  { id: '667538', title: 'Dune: Part Two', poster: poster('/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'), overview: 'Paul Atreides unites with Chani and the Fremen.', year: '2024', rating: 8.2, genre: 'Sci-Fi', type: 'movie' },
  { id: '693134', title: 'Dune', poster: poster('/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'), overview: 'A mythic and emotionally charged hero journey.', year: '2021', rating: 8.0, genre: 'Sci-Fi', type: 'movie' },
  { id: '1399', title: 'Game of Thrones', poster: poster('/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg'), overview: 'Nine noble families fight for control of Westeros.', year: '2011', rating: 8.5, genre: 'Drama', type: 'tv' },
  { id: '94605', title: 'Arcane', poster: poster('/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg'), overview: 'Two sisters fight on rival sides of a divided city.', year: '2021', rating: 8.7, genre: 'Animation', type: 'tv' },
  { id: '37854', title: 'One Piece', poster: poster('/fcXdJlbSdUEeMSJFsXKsznGwwok.jpg'), overview: 'The adventures of Monkey D. Luffy and his pirate crew.', year: '1999', rating: 8.7, genre: 'Anime', type: 'tv' },
];
