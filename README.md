# articledmapi

API to convert an HTML web page into markdown. Inspired in https://github.com/DominikPieper/obsidian-ReadItLater.
Working:

- Receive url with req.body.url
- Get page using got
- Create a DOM object from this response with JSDOM
- Clean unwanted stuff with DOMPurify
- Use Mozilla Readability to get page content in HTML format [GitHub - mozilla/readability: A standalone version of the readability lib](https://github.com/mozilla/readability)
- Convert HTML to ePub with [GitHub - cpiber/epub-gen-memory: Generate EPUB books from HTML with a simple API in Node.js and the browser.](https://github.com/cpiber/epub-gen-memory). I save the epub file in `/tmp` that is the only folder accesible with lambda fucntions via the API (Max 512Mb)
- Use [Nodemailer :: Nodemailer](https://nodemailer.com/about/) to send to Kindle
- Use turndown to convert the HTML into Markdown(in parseHtmlContent.js util) [GitHub - mixmark-io/turndown: 🛏 An HTML to Markdown converter written in JavaScript](https://github.com/mixmark-io/turndown)
- Respond with MD content and article details
