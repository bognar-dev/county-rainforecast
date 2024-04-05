

import { load } from 'cheerio';
import puppeteer from 'puppeteer';

export type MatchInfo = {
    location: string;
    teamA: string;
    teamB: string;
    date: string;
    id: string;
    time: string;

}


import { NextRequest, NextResponse } from 'next/server';


export const config = {
    runtime: 'edge',
}

export default async function handler(req: NextRequest) {

    const response = await scrapeMatches();
    console.log(response);
    return new NextResponse(JSON.stringify(response), {
        status: 200,
    })
}

async function scrapeMatches() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        const url = 'https://www.ecb.co.uk/county-championship/fixtures';
        await page.goto(url);

        // Get the HTML content of the page
        const content = await page.content();

        // Load the content into Cheerio
        const $ = load(content);

        const matches = $('.w-match-card__container').map((_, element) => {
            const getTextContent = (selector: string) => {
                const el = $(element).find(selector);
                return el ? el.text().trim() : '';
            };

            // Function to extract team information
            const getTeamInfo = (selector: string) => {
                const teamContainer = $(element).find(selector);
                const teamName = getTextContent('.w-match-card__team-name');
                const teamFlag = teamContainer.find('.w-match-card__team-flag').attr('class')?.split(' ')[1] || '';
                return {
                    name: teamName,
                    flag: teamFlag
                };
            };

            const date = getTextContent('.w-match-card__match-date');
            const time = getTextContent('.w-match-card__match-time');
            const format = getTextContent('.w-match-card__format');
            const teamA = getTeamInfo('.w-match-card__score-row--team-a');
            const teamB = getTeamInfo('.w-match-card__score-row--team-b');
            const location = getTextContent('.w-match-card__match-info');

            return {
                date,
                time,
                format,
                teamA,
                teamB,
                location
            };
        }).get();

        await browser.close();

        return matches;
    } catch (error) {
        console.error(error);
        await browser.close();
    }
}