"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FormEvent } from "react";

export default function SearchBar({
  setSearch,
}: {
  setSearch: (x: string) => void;
}) {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.target.search.value);
    setSearch(e.target.search.value);
  };
  return (
    <form className="w-full flex gap-2" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Search article by content only"
        id="search"
        name="search"
      />
      <Button variant={"ghost"}>
        <Search color="#1A1A1A" />
      </Button>
    </form>
  );
}
