"use client";
import { useEffect, useState } from "react";

interface Proposal {
  id: number;
  title: string;
  description: string;
  state: string;
  author: { firstName: string; lastName: string };
}

export default function MentorProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProposals() {
      try {
        const res = await fetch("/api/proposals");
        const data = await res.json();
        setProposals(data);
      } catch (err) {
        console.error("Error fetching proposals", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProposals();
  }, []);

  const handleAction = async (id: number, action: "APPROVED" | "REJECTED") => {
    await fetch(`/api/proposals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: action }),
    });
    setProposals((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, state: action } : p
      )
    );
  };

  if (loading) return <p>Loading proposals...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Proposals</h1>
      {proposals.length === 0 ? (
        <p>No proposals submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {proposals.map((proposal) => (
            <li
              key={proposal.id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold">{proposal.title}</h2>
              <p>{proposal.description}</p>
              <p className="text-sm text-gray-500">
                By {proposal.author?.firstName} {proposal.author?.lastName}
              </p>
              <p className="mt-2">
                Status:{" "}
                <span
                  className={`font-bold ${
                    proposal.state === "APPROVED"
                      ? "text-green-600"
                      : proposal.state === "REJECTED"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {proposal.state}
                </span>
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded"
                  onClick={() => handleAction(proposal.id, "APPROVED")}
                >
                  Approve
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleAction(proposal.id, "REJECTED")}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
