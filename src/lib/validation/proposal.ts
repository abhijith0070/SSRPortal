import { z } from 'zod';

export const proposalSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  attachment: z.string().optional(), // Allow any string for file URLs (comma-separated)
  link: z.string().optional(), // Allow any string for links
  // Allow for metadata to be passed but not validated
  _metadata: z.any().optional(),
});

export type ProposalInput = z.infer<typeof proposalSchema>;
