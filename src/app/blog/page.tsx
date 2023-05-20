"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SearchBar from "./searchBar";
import data from "@/lib/data.json";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info } from "lucide-react";

export default function Blog() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<
    {
      title: string;
      content: string;
      percentage: number;
      positions: {
        [key: string]: {
          query: string;
          position: string;
          percentage: number;
        };
      };
      positions_index: string[];
    }[]
  >();

  const fetchArticles = async () => {
    let result = await fetch(`/api/articles?search=${search}`).then((r) =>
      r.json()
    );
    setResult(result);
  };

  useEffect(() => {
    fetchArticles();
  }, [search]);

  return (
    <div className="flex flex-col gap-4 items-center w-full md:max-w-4xl md:p-10 mx-auto p-4">
      <SearchBar setSearch={(e) => setSearch(e)} />
      <p>
        <span className="text-[#825F0D] font-bold">
          {result && result.length}
        </span>{" "}
        article
        {result && result.length == 1 ? "" : "s"} found {search && "for "}
        <span className="text-zinc-400">{search}</span>
      </p>

      {result &&
        result.map((val, i) => (
          <>
            <Card className="w-full relative" key={i}>
              <CardHeader>
                <CardTitle>{val.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {val.content.split(" ").map((data, i) => (
                  <span
                    key={i}
                    className={
                      val.positions_index.includes(data.toLowerCase())
                        ? "font-bold text-[#825F0D]"
                        : ""
                    }
                  >
                    {data}{" "}
                  </span>
                ))}
                <div className="absolute right-0 top-0">
                  <div className="flex gap-2 items-center justify-center">
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-10 rounded-full p-0"
                          >
                            <Info className="h-4 w-4" />
                            <span className="sr-only">Open popover</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96">
                          <div className="overflow-y-auto max-h-48">
                            {Object.keys(val.positions).map(
                              (position, position_index) => (
                                <p
                                  className="border-b border-zinc-200 p-2 m-1 rounded-md"
                                  key={position}
                                >
                                  {val.positions[position].query} -{" "}
                                  <span className="font-bold">
                                    {val.positions[position].percentage.toFixed(
                                      2
                                    )}
                                  </span>
                                  % (
                                  <span className="text-[#825F0D]">
                                    {val.positions[position].position}
                                  </span>
                                  )
                                </p>
                              )
                            )}
                            {Object.keys(val.positions).length == 0 && (
                              <p className="text-center">Nothing here 😶</p>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="bg-accent p-2 w-fit m-2 rounded-md font-bold">
                      {val.percentage.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ))}
    </div>
  );
}
