import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useForm } from "react-hook-form";
import fetcher from '../lib/fetcher';
import { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
// import gfm from "remark-gfm";
// import rehypeRaw from "rehype-raw";

export default function Home() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [articulo, setArticulo] = useState(false)

  const onSubmit = data => {
    console.log(data)
    const res = fetcher("/api/api", { url: data.url, kindle: data.kindle, email: process.env.NEXT_PUBLIC_EMAIL }).then(
      (values) => {
        setArticulo({ title: values.title, author: values.author, excerpt: values.excerpt, date: values.date, filename: values.filename, content: values.content })

        console.log(articulo)
      })
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Articulo a Markdown y Kindle</title>
        <meta name="description" content="creado por lucas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className="font-bold text-5xl text-center">
          Ingresa una direccion!
        </h1>

        <form className="w-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>

          <input className="m-2 mt-8 h-10 align-middle text-center w-[95%] md:w-[90%] self-center" type="url" name="url" id="url"
            placeholder="https://example.com"
            pattern="https://.*" size="30"
            {...register("url", { required: true })} />
          <div className="flex flex-row justify-center">
            <input className="m-2 mt-4 h-10 bg-green-600 w-36 hover:bg-green-800 hover:text-gray-300 rounded-lg align-middle text-center self-center" type="submit" value="Convertir" />
            <label className="p-4 self-center"><input className="mr-2 p-2 rounded-md " type="checkbox" {...register("kindle")} />Kindle</label>

          </div>
        </form>
        {
          articulo && <div className="w-[95%] md:w-[80%] pt-4 flex flex-col" >
            <div className="text-center rounded-md bg-gray-900 flex flex-col m-1 p-2">
              <div className="font-semibold">Titulo</div>
              <div className=" font-thin font-sans">{articulo.title}</div>
            </div>
            <div className="text-center rounded-md bg-gray-900 flex flex-col m-1 p-2">
              <div className="font-semibold">Autor</div>
              <div className=" font-thin font-sans">{articulo.author}</div>
            </div>
            <div className="text-center rounded-md bg-gray-900 flex flex-col m-1 p-2">
              <div className="font-semibold">Resumen</div>
              <div className=" font-thin font-sans">{articulo.excerpt}</div>
            </div>
            <div className="text-center rounded-md bg-gray-900 flex flex-col m-1 p-2">
              <div className="font-semibold">Fecha</div>
              <div className=" font-thin font-sans">{articulo.date}</div>
            </div>
            <div className="text-center rounded-md bg-gray-900 flex flex-col m-1 p-2">
              <div className="font-semibold">Archivo</div>
              <div className=" font-thin font-sans">{articulo.filename}</div>
            </div>
            <ReactMarkdown
              // remarkPlugins={[gfm]}
              // rehypePlugins={[rehypeRaw]}
              className="text-center rounded-md bg-gray-900 font-thin colt-sans m-1 p-2"
            >{articulo.content}</ReactMarkdown>
          </div>

        }
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div >
  )
}
