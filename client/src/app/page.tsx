import Dashboard from "@/app/dashboard/page";
import Head from 'next/head';

export default function Home() {
  return (
    <>
    <Head>
        <title>Inv-Manage</title>
        <link rel="icon" href="https://praveenppk-inventorymanagement.s3.ap-south-1.amazonaws.com/logo.png" />
      </Head>
    <Dashboard />;
    </> 
  )
}
