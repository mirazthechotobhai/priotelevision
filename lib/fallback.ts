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
  { id: '157336', title: 'Interstellar', poster: poster('/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'), overview: 'Explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.', year: '2014', rating: 8.7, genre: 'Sci-Fi', type: 'movie' },
  { id: '155', title: 'The Dark Knight', poster: poster('/qJ2tW6WMUDux911r6m7haRef0WH.jpg'), overview: 'Batman faces a criminal mastermind who plunges Gotham into chaos.', year: '2008', rating: 8.5, genre: 'Action', type: 'movie' },
  { id: '680', title: 'Pulp Fiction', poster: poster('/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'), overview: 'Interlocking stories of crime and redemption unfold in Los Angeles.', year: '1994', rating: 8.5, genre: 'Crime', type: 'movie' },
  { id: '13', title: 'Forrest Gump', poster: poster('/arw2vcBveWOVZr6pxd9xtd1TdQa.jpg'), overview: 'A kind-hearted man witnesses and shapes decades of American history.', year: '1994', rating: 8.5, genre: 'Drama', type: 'movie' },
  { id: '27205', title: 'Inception', poster: poster('/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg'), overview: 'A skilled thief who steals secrets through dreams is offered one last impossible job.', year: '2010', rating: 8.4, genre: 'Sci-Fi', type: 'movie' },
  { id: '278', title: 'The Shawshank Redemption', poster: poster('/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'), overview: 'Two imprisoned men find hope and friendship over many years.', year: '1994', rating: 8.7, genre: 'Drama', type: 'movie' },
  { id: '238', title: 'The Godfather', poster: poster('/3bhkrj58Vtu7enYsRolD1fZdja1.jpg'), overview: 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.', year: '1972', rating: 8.7, genre: 'Crime', type: 'movie' },
  { id: '603', title: 'The Matrix', poster: poster('/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'), overview: 'A hacker discovers that reality is an elaborate simulation.', year: '1999', rating: 8.2, genre: 'Sci-Fi', type: 'movie' },
  { id: '496243', title: 'Parasite', poster: poster('/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'), overview: 'A struggling family becomes entangled with a wealthy household.', year: '2019', rating: 8.5, genre: 'Thriller', type: 'movie' },
  { id: '497', title: 'The Green Mile', poster: poster('/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg'), overview: 'A prison guard encounters a gentle giant with a mysterious gift.', year: '1999', rating: 8.5, genre: 'Drama', type: 'movie' },
  { id: '244786', title: 'Whiplash', poster: poster('/7fn624j5lj3xTme2SgiLCeuedmO.jpg'), overview: 'A young drummer pursues greatness under an intimidating instructor.', year: '2014', rating: 8.4, genre: 'Drama', type: 'movie' },
  { id: '1399', title: 'Game of Thrones', poster: poster('/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg'), overview: 'Nine noble families fight for control of Westeros.', year: '2011', rating: 8.5, genre: 'Drama', type: 'tv' },
  { id: '94605', title: 'Arcane', poster: poster('/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg'), overview: 'Two sisters fight on rival sides of a divided city.', year: '2021', rating: 8.7, genre: 'Animation', type: 'tv' },
  { id: '37854', title: 'One Piece', poster: poster('/fcXdJlbSdUEeMSJFsXKsznGwwok.jpg'), overview: 'The adventures of Monkey D. Luffy and his pirate crew.', year: '1999', rating: 8.7, genre: 'Anime', type: 'tv' },
];
