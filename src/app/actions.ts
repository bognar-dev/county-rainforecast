"use server"


import db from '@/db/drizzle';
import { match } from "@/db/schema";
import { revalidatePath } from "next/cache";
import puppeteer from "puppeteer";




export async function scrapeMatches() {

    console.log('Scraping website...')
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const url = 'https://www.ecb.co.uk/county-championship/fixtures';
    console.log('Navigating to page ' + url)
    await page.goto(url);
    console.log('Page loaded')

    const matches = await page.evaluate(() => {
        const matchElements = Array.from(document.querySelectorAll('.w-match-card__container'));

        // Function to extract text content from an element or return empty string if element not found
        const getTextContent = (element: Element | null) => element ? element.textContent?.trim() || '' : '';

        // Function to extract team information
        const getTeamInfo = (container: Element) => {
            const teamName = container.querySelector('.w-match-card__team-name');
            const teamFlag = container.querySelector('.w-match-card__team-flag');
            return getTextContent(teamName)
        };

        const getLocationInfo = (container: Element) => {
            if(!container) return console.log('No location found')
            const location = container.querySelector('.w-match-card__match-info--sub');
            const locationName = getTextContent(location);
            console.log(locationName);
            return locationName;
        }

        return matchElements.map(matchElement => {
            const date = getTextContent(document.querySelector('.w-fixture-listing__heading'));
            const format = getTextContent(matchElement.querySelector('.w-match-card__format'));
            const teamA = getTeamInfo(matchElement.querySelector('.w-match-card__score-row--team-a')!);
            const teamB = getTeamInfo(matchElement.querySelector('.w-match-card__score-row--team-b')!);
            const location = getLocationInfo(matchElement.querySelector('.w-match-card__match-info-container')!);
            return { date, format, teamA, teamB, location};
        });
    });

    console.log(matches);
    await db.insert(match).values(matches.map(match => ({
        date: match.date,
        format: match.format,
        teamA: match.teamA,
        teamB: match.teamB,
        location: match.location || '', // Ensure location is always a string
    })));

    await browser.close();
    revalidatePath('/');
}
