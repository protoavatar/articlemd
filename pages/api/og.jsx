import { ImageResponse } from '@vercel/og';
import { Container } from 'postcss';

export const config = {
  runtime: 'experimental-edge',
};

// Make sure the font exists in the specified path:
const font = fetch(new URL('../../lib/TYPEWR__.TTF', import.meta.url)).then(
  (res) => res.arrayBuffer(),
);


export default async function handler(req) {
  const fontData = await font;
  const { searchParams } = req.nextUrl;
  const src = searchParams.get('url');
  const title = searchParams.get('title');
  const author = searchParams.get('author');
  const time = searchParams.get('time');

  console.log(time)

  if (!src) {
    return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
      width: 1200,
      height: 630,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',

          fontFamily: '"Typewriter"',
          color: 'black',
          background: '#f6f6f6',
          width: '100%',
          height: '100%',
          paddingTop: 50,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',


        }}
      >

        <img
          width="625"
          src={src}
          style={{
            width: '100%',
            objectFit: 'scale-down'
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            position: 'absolute',
            bottom: '100px',
            width: '100%',
            textAlign: 'center',
            paddingLeft: '15px',
            paddingRight: '15px',
            background: 'rgba(204, 204, 204, 0.8)',
            fontFamily: '"Typewriter"',
          }}
        >
          {title && <p style={{ lineHeight: '250%', fontSize: 60, marginTop: '10px', paddingTop: 0 }}>{title}</p>}
          {author && (author !== "No Author" && <p style={{ lineHeight: '250%', fontSize: 40, textAlign: 'center', alignSelf: 'center', marginBottom: '5px', marginTop: '5px' }}>{author}</p>)}
          {time && (<p style={{ lineHeight: '250%', fontSize: 20, textAlign: 'center', marginBottom: '5px', marginTop: '5px' }}>Tiempo de Lectura: {time}</p>)}
        </div>

      </div >
    ),
    {
      width: 625,
      height: 1000,
      fonts: [
        {
          name: 'Typewriter',
          data: fontData,
          style: 'normal',
        },
      ],
    },
  );
}