import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
         <link href='http://fonts.googleapis.com/css?family=Lato:400, 700' rel='stylesheet' type='text/css'/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}