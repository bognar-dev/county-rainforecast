import Image from "next/image";
import WeatherOverview from "@/app/(components)/weather-overview";
import { getMatches } from "./(api)/get-matches";
import Test from "./(components)/test";
import { Key } from "react";
import { MatchInfo } from "./(api)/scrape-matches";

export default async function Home() {
  const currentTime = new Date();
  const matches = await getMatches()
  //filter matches that are in the future on the ones for the next/this week
  const filteredMatches = matches.filter((match: { date: string | number | Date; }) => {
    const matchDate = new Date(match.date);
    //check if the match is more then 7 days in the future
    return matchDate.getTime() - currentTime.getTime() < 7 * 24 * 60 * 60 * 1000;

  });

  return (
    <main className="">
      <h1 className="text-4xl font-bold">Upcoming Matches</h1>
      <Test/> 
      {matches && matches.map((match, index: Key | null | undefined) => (
        <div key={index} className="border shadow-md">
          <WeatherOverview
            key={index}
            fixture={match}
            weather={[
              {
                id: 1,
                main: 'Clear',
                description: 'clear sky',
                icon: '01d',
                type: 'Rain',
                time: currentTime
              },
              {
                id: 2,
                main: 'Clouds',
                description: 'few clouds',
                icon: '02d',
                type: 'Clouds',
                time: currentTime
              },
              {
                id: 3,
                main: 'Rain',
                description: 'light rain',
                icon: '10d',
                type: 'Clear',
                time: currentTime
              }
            ]}
          />
        </div>
      ))}
    </main>
  );
}

