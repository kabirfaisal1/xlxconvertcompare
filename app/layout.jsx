// golbal layout for the app

// golbal Importing

import { Inter } from 'next/font/google';
// import { ToastProvider } from '@/providers/toast-provider';
import "react-toastify/dist/ReactToastify.css";
// // local Importing


// Importing CSS
import './globals.css';


const inter = Inter( { subsets: ['latin'] } );

export const metadata = {
  title: 'Convert and Compare Excel',
  description: 'Convert and Compare Excel',
};

export default async function RootLayout ( { children } )
{
  return (

    <html lang='en'>
      <body className={inter.className}>
        {/* <ToastProvider />*/}

        {children}
      </body>
    </html>

  );
}
