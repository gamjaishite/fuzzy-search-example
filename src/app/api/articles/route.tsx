import data from "@/lib/data.json";
import { levenshtein } from "@/lib/levensthein";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchText = url.searchParams.get("search");
  const result: {
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
  }[] = [];

  if (!searchText || searchText === "") {
    data.data.map((val) => {
      result.push({
        title: val.title,
        content: val.content,
        percentage: 100,
        positions: {},
        positions_index: [],
      });
    });
    return NextResponse.json(result);
  }

  const tempResult: {
    [key: string]: {
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
    };
  } = {};
  data.data.map((data, i) => {
    const content_list = data.content.split(" ");
    content_list.map((content, k) => {
      const search_text_splitted = searchText.trim().split(" ");
      search_text_splitted.map((text, j) => {
        const similarity = levenshtein(
          text.toLowerCase(),
          content.toLowerCase()
        );
        if (similarity > 60) {
          if (
            tempResult[i] &&
            tempResult[i].positions[j] &&
            tempResult[i].positions[j].percentage < similarity
          ) {
            tempResult[i].positions[j].percentage = similarity;
            tempResult[i].positions[j].position = content;
          } else if (!tempResult[i]) {
            tempResult[i] = {
              title: data.title,
              content: data.content,
              percentage: similarity,
              positions: {},
              positions_index: [],
            };
            tempResult[i].positions[j] = {
              query: text,
              position: content,
              percentage: similarity,
            };
          } else if (!tempResult[i].positions[j]) {
            tempResult[i].positions[j] = {
              query: text,
              position: content,
              percentage: similarity,
            };
          }
          let total_percentage = 0;
          let total_position = 0;
          Object.keys(tempResult[i].positions).map((key) => {
            total_percentage += tempResult[i].positions[key].percentage;
            total_position++;
          });
          tempResult[i].percentage =
            total_percentage / search_text_splitted.length;
        }
      });
    });
  });
  Object.keys(tempResult).map((key) => {
    let position_list: string[] = [];
    Object.keys(tempResult[key].positions).map((position_key) => {
      position_list.push(tempResult[key].positions[position_key].position);
    });
    position_list.map((val) =>
      tempResult[key].positions_index.push(val.toLowerCase())
    );
    result.push(tempResult[key]);
  });
  result.sort((a, b) => b.percentage - a.percentage);
  return NextResponse.json(result);
}
