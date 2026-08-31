import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cars = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cars' }),
  schema: z.object({
    brand: z.string(),
    model: z.string(),
    yearFrom: z.number(),
    yearTo: z.number().optional(),
    engines: z.array(
      z.object({
        name: z.string(),
        displacement: z.string(),
        power_ps: z.number(),
        fuel: z.string(),
      })
    ),
    equipment: z.array(z.string()),
    rating: z.number().min(1).max(10),
    sources: z.array(z.string().url()),
  }),
});

export const collections = { cars };
