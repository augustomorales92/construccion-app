"use client";

import Banner from "@/components/landing/HeroBanner";
import CardGrid from "@/components/landing/CardGrid";
import FavoriteWorks from "@/components/landing/FavoriteWorks";
import { useState } from "react";
import HeroBanner from "@/components/landing/HeroBanner";

export default  function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Aquí puedes implementar la lógica de búsqueda
    console.log("Buscando:", query);
  };
  return (
    <>
      <div className="min-h-screen w-full bg-background">
      <HeroBanner onSearch={handleSearch} />
        <FavoriteWorks />
        <CardGrid searchQuery={searchQuery} />
      </div>
    </>
  );
}
