import { scrapeMatches } from "../actions"




export default function Test() {
    
    return (
        <div>
            <form action={scrapeMatches}>
                <button>Scrape Matches</button>
            </form>
        </div>
    )
        
}