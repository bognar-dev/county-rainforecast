import db from '@/db/drizzle';
import { match } from '@/db/schema';

export const getMatches = async () => {
  const data = await db.select().from(match);
  return data;
};