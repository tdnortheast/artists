export interface Track {
  id: string;
  title: string;
  duration: string;
}

export interface Release {
  id: string;
  title: string;
  type: 'album' | 'single';
  releaseDate: string;
  coverArt: string;
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
  password: string;
  releases: Release[];
}

export const artists: Artist[] = [
  {
    id: 'yuno-sweez',
    name: 'Yuno $weez',
    password: 'Benkifiya1',
    releases: [
      {
        id: 'sweez-city',
        title: '$weezCity',
        type: 'album',
        releaseDate: '2025-12-25',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/88/94/98/8894986e-c4c6-f301-3f2e-bd0dbe21bf96/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'fatimah', duration: '1:24' },
          { id: '2', title: 'DONOTRUNUPONME!', duration: '1:43' },
          { id: '3', title: 'Beamer (feat. Yuno Benz)', duration: '1:51' },
          { id: '4', title: 'Issey Miyake', duration: '1:57' },
          { id: '5', title: 'Oxycodone (feat. JBEETLE)', duration: '2:49' },
          { id: '6', title: 'SUNDAYMORNINGCHURCH (feat. Jadi)', duration: '3:20' },
          { id: '7', title: 'Let Me Interlude', duration: '2:11' },
          { id: '8', title: 'Law Fawk Order', duration: '1:42' },
          { id: '9', title: 'Purple Drank', duration: '2:19' },
          { id: '10', title: 'Givenchy', duration: '1:51' },
        ],
      },
      {
        id: 'lost-files',
        title: 'lost files from $weez',
        type: 'album',
        releaseDate: '2026-01-02',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/de/1d/ae/de1dae3c-113c-ed1a-8c08-02ebc1f779f3/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'Lost Intro (feat. soløwøn)', duration: '2:27' },
          { id: '2', title: 'Mona Lisa', duration: '2:16' },
          { id: '3', title: 'Yuno $weez', duration: '1:20' },
          { id: '4', title: 'Bugatti Way (feat. YunoKaydee)', duration: '1:55' },
          { id: '5', title: 'Middleman', duration: '1:50' },
          { id: '6', title: 'Boondocks (feat. svspperkk)', duration: '3:07' },
          { id: '7', title: 'For Me (feat. svspperkk)', duration: '2:07' },
          { id: '8', title: 'Outer Banks', duration: '2:08' },
          { id: '9', title: 'Pain (feat. Kaminar1)', duration: '2:25' },
          { id: '10', title: '$he Lit', duration: '2:03' },
          { id: '11', title: 'Lost Outro', duration: '1:31' },
        ],
      },
      {
        id: 'xans-wrld',
        title: 'Xan$wrld',
        type: 'single',
        releaseDate: '2026-01-03',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/11/d7/27/11d7272c-67dc-1aa4-2525-2ff23f71fd33/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'Xan$wrld', duration: '2:10' },
        ],
      },
      {
        id: 'boondocks',
        title: 'Boondocks',
        type: 'single',
        releaseDate: '2026-01-03',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a4/a5/15/a4a515a7-227c-6655-d26b-3e8c2e481cd4/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'Boondocks (feat. svspperkk & $p@de)', duration: '3:50' },
        ],
      },
      {
        id: 'perkys',
        title: 'PERKY$',
        type: 'single',
        releaseDate: '2026-01-19',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/68/73/53/68735313-0fa6-51d1-2912-9dcfb1d8d64b/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'PERKY$', duration: '1:54' },
        ],
      },
      {
        id: 'payme',
        title: 'Pay Me!',
        type: 'single',
        releaseDate: '2026-01-19',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/12/70/a3/1270a327-2ce4-7e17-dc42-402ce499eed1/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'Pay Me! (feat. Yuno Benz)', duration: '2:03' },
        ],
      },
    ],
  },
  {
    id: 'jamar',
    name: 'J@M@R',
    password: 'jamar123',
    releases: [
      {
        id: 'freaking-music',
        title: 'I AM THE FREAKING MUSIC',
        type: 'single',
        releaseDate: '2025-10-30',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bd/5b/9a/bd5b9aad-d071-d193-96f1-09a9ffdec549/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'I AM THE FREAKING MUSIC', duration: '2:46' },
        ],
      },
    ],
  },
];
