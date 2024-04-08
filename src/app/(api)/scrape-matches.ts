import db from '@/db/drizzle';
import { match } from '@/db/schema';
import puppeteer from 'puppeteer';

export type MatchInfo = {
    location: string;
    teamA: string;
    teamB: string;
    date: string;
    id: string;

}


import { NextRequest, NextResponse } from 'next/server';

export const config = {
    runtime: 'edge',
}

export default async function handler(req: NextRequest) {

    const response = await scrapeMatches();
    return new NextResponse(JSON.stringify(response), {
        status: 200,
    })
}


export async function scrapeMatches() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        const url = 'https://www.ecb.co.uk/county-championship/fixtures'; // Replace 'YOUR_URL_HERE' with the URL of the webpage you want to scrape
        await page.goto(url);

        const matches = await page.evaluate(() => {
            const matchElements = Array.from(document.querySelectorAll('.w-match-card__container'));
            // Function to extract text content from an element or return empty string if element not found
            const getTextContent = (element: Element | null) => element ? element.textContent?.trim() || '' : '';

            // Function to extract team information
            const getTeamInfo = (container: Element) => {
                const teamName = container.querySelector('.w-match-card__team-name');
                const teamFlag = container.querySelector('.w-match-card__team-flag');
                return {
                    name: getTextContent(teamName),
                    flag: teamFlag ? teamFlag.classList.item(1) || '' : ''
                };
            };

            const getLocationInfo = (container: Element) => {
                const location = container.querySelector('.w-match-card__match-info--sub');
                const locationName = getTextContent(location);
                console.log(locationName);
                return locationName;
            }

            return matchElements.map(matchElement => {
                let date = getTextContent(matchElement.querySelector('w-match-card__match-live-label'));
                console.log("Date live: " + date);
                if (!date || date === '') {
                    date = getTextContent(matchElement.querySelector('.match-card__match-time-user'));
                }
                const time = getTextContent(matchElement.querySelector('.w-match-card__match-time'));
                const format = getTextContent(matchElement.querySelector('.w-match-card__format'));
                const teamA = getTeamInfo(matchElement.querySelector('.w-match-card__score-row--team-a')!);
                const teamB = getTeamInfo(matchElement.querySelector('.w-match-card__score-row--team-b')!);
                const location = getLocationInfo(matchElement.querySelector('.w-match-card__match-info-container')!);

                db.insert(match).values({date, teamA: teamA.name, teamB: teamB.name, location });
            });

        });



    } catch (error) {
        console.error('Error scraping website:', error);
    } finally {
        await browser.close();
    }
}





