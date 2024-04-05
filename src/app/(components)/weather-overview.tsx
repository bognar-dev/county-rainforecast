import { MatchInfo } from "../(api)/scrape-matches"



type Weather = {
    id: number
    main: string
    description: string
    icon: string
    type: string
    time: Date
}




export default function WeatherOverview({ fixture, weather }: { fixture: MatchInfo, weather: Weather[] }) {
    const weatherColor: { [key: string]: string } = {
        Clear: 'bg-yellow-100',
        Clouds: 'bg-gray-100',
        Rain: 'bg-blue-100'
    };


    return (
        <div className="flex w-full items-stretch space-x-4">
            <div className="text-lg font-bold ">{fixture.location}</div>
            <div className="text-lg font-bold ">
                <span className="sr-only">{fixture.teamA} vs {fixture.teamB}</span>
                <span>{fixture.teamA} vs {fixture.teamB}</span>

            </div>

            <div className="flex items-center w-full rounded-lg border border-gray-200 dark:border-gray-800 p-1">
                {weather.map((w) => (
                    <div key={w.id} className="flex flex-col ">
                        <div className={`min-w-56 h-3 rounded-lg ${weatherColor[w.type]}`} />
                        <span className="max-w-2 justify-items-end">{`${w.time.getHours()}:${w.time.getMinutes()}`}</span>


                    </div>
                ))}
            </div>
        </div>
    );
}

