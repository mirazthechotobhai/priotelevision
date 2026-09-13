export type Media={id:string;title:string;poster:string;overview:string;year:string;rating:number;genre:string;type:'movie'|'tv'};
const img=(path:string)=>path?`https://image.tmdb.org/t/p/w500${path}`:'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop';
const mock:Media[]=[['872585','Oppenheimer','/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg','The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.','2023',8.1,'Drama','movie'],['667538','Dune: Part Two','/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg','Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.','2024',8.2,'Sci-Fi','movie'],['693134','Dune','/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg','A mythic and emotionally charged hero’s journey.','2021',8.0,'Sci-Fi','movie'],['1399','Game of Thrones','/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg','Nine noble families fight for control over the lands of Westeros.','2011',8.5,'Drama','tv'],['94605','Arcane','/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg','Amid the stark discord between twin cities, two sisters fight on rival sides.','2021',8.7,'Animation','tv'],['37854','One Piece','/fcXdJlbSdUEeMSJFsXKsznGwwok.jpg','The adventures of Monkey D. Luffy and his pirate crew.','1999',8.7,'Anime','tv']].map(([id,title,p,o,y,r,g,type])=>({id:id as string,title:title as string,poster:img(p as string),overview:o as string,year:y as string,rating:r as number,genre:g as string,type:type as 'movie'|'tv'}));
async function tmdb(path:string):Promise<any>{
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;
  try {
    const url = new URL(`https://api.themoviedb.org/3${path}`);
    url.searchParams.set('api_key', key);
    const r = await fetch(url, { next: { revalidate: 300 } });
    if (!r.ok) return null;
    const data = await r.json();
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}
function normalize(x:any,type:'movie'|'tv'):Media{return{id:String(x.id),title:x.title||x.name,poster:img(x.poster_path),overview:x.overview||'No overview available.',year:(x.release_date||x.first_air_date||'').slice(0,4)||'—',rating:x.vote_average||0,genre:'Featured',type}}
const results = (data:any): any[] => Array.isArray(data?.results) ? data.results : [];
export async function getTrending(){const items=results(await tmdb('/trending/all/week?language=en-US')).filter((x:any)=>x.media_type!=='person').slice(0,10);return items.length?items.map((x:any)=>normalize(x,x.media_type==='tv'?'tv':'movie')):mock.slice(0,5)}
export async function getByGenre(id:number){const items=results(await tmdb(`/discover/tv?with_genres=${id}&sort_by=popularity.desc`)).slice(0,10);return items.length?items.map((x:any)=>normalize(x,'tv')):mock.slice(4)}
export async function searchTitles(q:string,type?:string){const items=results(await tmdb(`/search/${type||'multi'}?query=${encodeURIComponent(q)}&language=en-US`)).filter((x:any)=>x.media_type!=='person').slice(0,20);return items.length?items.map((x:any)=>normalize(x,x.media_type==='tv'||type==='tv'?'tv':'movie')):mock.filter(x=>x.title.toLowerCase().includes(q.toLowerCase()))}
export async function getTitle(id:string){
  const found = mock.find(x => x.id === id);
  if (found) return found;
  const movie = await tmdb(`/movie/${encodeURIComponent(id)}?language=en-US`);
  if (movie) return normalize(movie, 'movie');
  const tv = await tmdb(`/tv/${encodeURIComponent(id)}?language=en-US`);
  return tv ? normalize(tv, 'tv') : undefined;
}
