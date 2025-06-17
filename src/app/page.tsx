import Image from "next/image";
import AppHeader from "./components/app-header";
import { SnackbarProvider } from "notistack";

export default function Home() {
  return (

    <div className="flex flex-col min-h-screen">
      <main>
        <h1>Main component</h1>
      </main>
    </div>

  );
}
