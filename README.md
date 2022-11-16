# articledmapi

API to convert an HTML web page into markdown. Inspired in https://github.com/DominikPieper/obsidian-ReadItLater.
Working:

- Receive url with req.body.url
- Get page using got
- Create a DOM object from this response with JSDOM
- Clean unwanted stuff with DOMPurify
- Use Mozilla Readability to get page content in HTML format [GitHub - mozilla/readability: A standalone version of the readability lib](https://github.com/mozilla/readability)
- Convert HTML to ePub with [GitHub - cpiber/epub-gen-memory: Generate EPUB books from HTML with a simple API in Node.js and the browser.](https://github.com/cpiber/epub-gen-memory). I save the epub file in `/tmp` that is the only folder accesible with lambda functions via the API (Max 512Mb)
- Use [OG Image Generation – Vercel Docs](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation) to generate the cover for kindle epub. It retrieves 'og:image' image from the `meta` html tags, and in case it does not exist, it uses [Lexica Search API](https://lexica.art/docs) to retrieve an AI generated image. I had to save the image to the `/tmp` folder in order for it to work.
- Use [Nodemailer :: Nodemailer](https://nodemailer.com/about/) to send to Kindle
- Use turndown to convert the HTML into Markdown(in parseHtmlContent.js util) [GitHub - mixmark-io/turndown: 🛏 An HTML to Markdown converter written in JavaScript](https://github.com/mixmark-io/turndown)
- Respond with MD content and article details
