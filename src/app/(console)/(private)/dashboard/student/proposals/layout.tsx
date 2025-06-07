import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Proposal',
  description: 'Submit and manage your project proposal',
};

export default function ProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 