import { AbstractType } from "@prisma/client";
import z from "zod";

export const AbstractCreateSchema = z.object({
  type: z.enum([AbstractType.Post, AbstractType.Talk]),
  title: z.string().min(5).max(255),
  content: z.string().min(5),
});

export const AbstractUpdateSchema = AbstractCreateSchema.partial();

export const AuthorsCreateSchema = z.object({
  authorName: z.string().max(255),
  email: z.string().email(),
  region: z.string().max(255),
  staff: z.string().max(255),
  speaker: z.boolean(),
  correspondingAuthor: z.boolean(),
});

export const AuthorUpdateSchema = AuthorsCreateSchema.partial();
