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
          fontSize: 60,
          fontFamily: '"Typewriter"',
          color: 'black',
          background: '#f6f6f6',
          width: '100%',
          height: '100%',
          paddingTop: 50,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          lineHeight: '300%'

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
            justifyContent: 'flex-start',
            position: 'absolute',
            top: '1px',
            width: '100%',
            textAlign: 'center',
            paddingLeft: '15px',
            paddingRight: '15px',
            background: 'rgba(204, 204, 204, 0.8)',
            fontFamily: '"Typewriter"',
          }}
        >
          {title && <p>{title}</p>}
          {author && (author !== "No Author" && <p style={{ fontSize: 40, textAlign: 'right', alignSelf: 'flex-end' }}>{author}</p>)}
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