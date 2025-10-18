'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Users, 
  Mail, 
  User, 
  FileText, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Team {
  id: string;
  teamNumber: string;
  projectTitle: string;
  status: string;
  mentor: {
    id: string;
    name: string;
    email: string;
  } | null;
  lead: {
    name: string;
    email: string;
  } | null;
  members: TeamMember[];
  project: {
    id: string;
    name: string;
    description: string;
    theme: {
      name: string;
    };
    code: string;
  } | null;
  proposals?: any[];
}

const ViewDetailsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [searchTerm, statusFilter, teams]);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/teams');
      
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }

      const data = await response.json();
      setTeams(data);
      setFilteredTeams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teams');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTeams = () => {
    let filtered = teams;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(team => 
        team.teamNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.mentor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.lead?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(team => team.status === statusFilter);
    }

    setFilteredTeams(filtered);
  };

  const toggleTeamExpansion = (teamId: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      INACTIVE: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-red-900">Error</h2>
          </div>
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchTeams}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Details</h1>
          <p className="mt-2 text-gray-600">
            View comprehensive information about all teams, members, and mentors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teams</p>
                <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {teams.filter(t => t.status === 'ACTIVE').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {teams.filter(t => t.status === 'PENDING').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teams.reduce((sum, team) => sum + team.members.length, 0)}
                </p>
              </div>
              <User className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by team number, project, mentor, or lead..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Teams List */}
        <div className="space-y-4">
          {filteredTeams.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No teams found matching your criteria</p>
            </div>
          ) : (
            filteredTeams.map((team) => {
              const isExpanded = expandedTeams.has(team.id);
              
              return (
                <div key={team.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Team Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleTeamExpansion(team.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {team.teamNumber || 'No Team Number'}
                          </h3>
                          {getStatusBadge(team.status)}
                        </div>
                        <p className="text-gray-600 mb-2">
                          {team.projectTitle || 'No Project Title'}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {team.members.length} members
                          </div>
                          {team.mentor && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              Mentor: {team.mentor.name}
                            </div>
                          )}
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-6 w-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Mentor & Lead Info */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <User className="h-5 w-5 mr-2 text-blue-600" />
                            Mentor & Lead
                          </h4>
                          <div className="space-y-3 bg-white rounded-lg p-4">
                            {team.mentor ? (
                              <div>
                                <p className="text-sm font-medium text-gray-700">Mentor</p>
                                <p className="text-gray-900">{team.mentor.name}</p>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {team.mentor.email}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No mentor assigned</p>
                            )}
                            
                            {team.lead && (
                              <div className="pt-3 border-t">
                                <p className="text-sm font-medium text-gray-700">Team Lead</p>
                                <p className="text-gray-900">{team.lead.name}</p>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {team.lead.email}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Project Info */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-green-600" />
                            Project Information
                          </h4>
                          <div className="bg-white rounded-lg p-4">
                            {team.project ? (
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Project Name</p>
                                  <p className="text-gray-900">{team.project.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Code</p>
                                  <p className="text-gray-900">{team.project.code}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Theme</p>
                                  <p className="text-gray-900">{team.project.theme?.name || 'N/A'}</p>
                                </div>
                                {team.project.description && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Description</p>
                                    <p className="text-sm text-gray-600">{team.project.description}</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No project assigned</p>
                            )}
                          </div>
                        </div>

                        {/* Team Members */}
                        <div className="md:col-span-2">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Users className="h-5 w-5 mr-2 text-purple-600" />
                            Team Members ({team.members.length})
                          </h4>
                          <div className="bg-white rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {team.members.length > 0 ? (
                                  team.members.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                        {member.name}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        {member.email}
                                      </td>
                                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                          {member.role}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                                      No members in this team
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsPage;
