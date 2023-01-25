// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import got from 'got';
import DOMPurify from 'isomorphic-dompurify';
import { isProbablyReaderable, Readability } from '@mozilla/readability';
import { parseHtmlContent } from '../../utils/parsehtml';
import dayjs from 'dayjs';
import { writeFileSync, writeFile } from 'fs';
import path from 'path';
import epub from "epub-gen-memory";
import nodemailer from "nodemailer"


export default async function handler(req, res) {
  if (
    req.method !== "POST" ||
    req.headers.authorization !== process.env.NEXT_PUBLIC_TOKEN
  ) {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  // const url = "https://future.com/developers-side-projects/?utm_medium=email&utm_source=newsletter&mkt_tok=MzgyLUpaQi03OTgAAAGGQTjERdPvGE5wI5UlqmAvyboZJwIRPwsryqF-wjKhZQWohA8B06oPrjxDwwYCdXKtig9a_a2gAnDWrAj90-e6T9DOao4lW5zEPzUAvvEmwhRBgw"
  console.log(req.body)
  const url = req.body.url
  const email = req.body.email



  const response = await got(url);
  const { JSDOM } = require('jsdom');
  let document = new JSDOM(response.body, {
    url: url
  });



  const cleanDocumentBody = DOMPurify.sanitize(document.body);
  document.body = cleanDocumentBody;

  const readableDocument = new Readability(document.window.document).parse();
  const fecha = dayjs().format('YYYY-MM-DD')


  // mover dentro del envio a kindle luego
  let sanitize = require("sanitize-filename");
  //get og:image for cover-image
  const meta = document.window.document.querySelector('meta[property="og:image"]');
  let cover = meta && meta.getAttribute('content');

  if (!cover) {
    const lexicaJson = await fetch("https://lexica.art/api/v1/search?q=" + sanitize(readableDocument?.title || "Article " + fecha))
    const lexicaData = await lexicaJson.json()
    cover = lexicaData.images[Math.floor(Math.random() * 50)].srcSmall
  }

  console.log(cover)



  if (readableDocument?.content) {

    // Reading time
    const wpm = 225;
    const words = readableDocument.textContent.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    console.log("Palabras: " + words)
    console.log("Tiempo de lectura: " + time)

    const filename = sanitize(readableDocument?.title || "Article " + fecha)

    if (req.body.kindle && req.body.email) {

      const file = path.join("/tmp", 'book.epub');

      await downloadImage(process.env.HTTP + process.env.VERCEL_URL + "/api/og?title=" + encodeURI(readableDocument?.title || "Sin Titulo") + "&author=" + encodeURI(readableDocument?.byline || "No Author") + "&url=" + cover, "/tmp/cover.png" + "&time=" + time);

      const option = {
        title: readableDocument?.title || "Sin Titulo", // *Required, title of the book.
        author: readableDocument?.byline || "No Author", // *Required, name of the author.
        ignoreFailedDownloads: true,
        date: fecha,
        // publisher: "Macmillan & Co.", // optional
        cover: "file:///tmp/cover.png",
      };

      const transporter = nodemailer.createTransport({
        // host: "smtp.gmail.com",
        // port: 587,
        // secure: true,
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: readableDocument?.title || "Sin Titulo",
        html: `Article`,
        attachments: [
          {
            filename: filename + '.epub',
            path: file,
            contentType: 'application/epub+zip',
          },
        ],
      };

      const arch = await epub(option, [{ title: readableDocument?.title || "Sin Titulo", beforeToc: true, content: readableDocument.content }])
      await writeFileSync(file, arch);


      const info = await transporter.sendMail(mailOptions)

      console.log("Archivo Escrito")
      console.log(info)
    }
    const markdown = await parseHtmlContent(readableDocument.content)
    const answer = { title: readableDocument.title, author: readableDocument.byline, excerpt: readableDocument.excerpt, date: fecha, content: markdown, filename: filename }

    // console.log(answer)
    res.status(200).json(answer)
    // res.status(200).json(lexicaData)
  } else {
    const answer = { title: "Article " + fecha + "-" + Math.floor(Math.random() * 10).toString(), author: "", excerpt: "", date: fecha, content: url, filename: "Article " + fecha + "-" + Math.floor(Math.random() * 10).toString() }
    console.log(answer)
    res.status(200).json(answer)
  }

}

const downloadImage = async (url, path) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await writeFileSync(path, buffer);
}