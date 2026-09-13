export type FallbackMedia = {
  id: string;
  title: string;
  poster: string;
  year: string;
  rating: number;
  genre: string;
};

const poster = (path: string) => `https://image.tmdb.org/t/p/w500${path}`;

export const fallbackMedia: FallbackMedia[] = [
  { id: '872585', title: 'Oppenheimer', poster: poster('/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'), year: '2023', rating: 8.1, genre: 'Drama' },
  { id: '667538', title: 'Dune: Part Two', poster: poster('/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'), year: '2024', rating: 8.2, genre: 'Sci-Fi' },
  { id: '693134', title: 'Dune', poster: poster('/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'), year: '2021', rating: 8.0, genre: 'Sci-Fi' },
  { id: '1399', title: 'Game of Thrones', poster: poster('/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg'), year: '2011', rating: 8.5, genre: 'Drama' },
  { id: '94605', title: 'Arcane', poster: poster('/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg'), year: '2021', rating: 8.7, genre: 'Animation' },
  { id: '37854', title: 'One Piece', poster: poster('/fcXdJlbSdUEeMSJFsXKsznGwwok.jpg'), year: '1999', rating: 8.7, genre: 'Anime' },
];
