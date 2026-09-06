import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getProjects,
  getSkills,
  getExperience,
  getCertificates,
  getResume,
} from '../../firebase/firestore';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projectsCount: 0,
    skillsCount: 0,
    experienceCount: 0,
    certificatesCount: 0,
  });
  const [resume, setResume] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [p, s, e, c, r] = await Promise.all([
          getProjects(),
          getSkills(),
          getExperience(),
          getCertificates(),
          getResume(),
        ]);
        setStats({
          projectsCount: p.length,
          skillsCount: s.length,
          experienceCount: e.length,
          certificatesCount: c.length,
        });
        setRecentProjects(p.slice(0, 4));
        setResume(r);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-white/60 text-sm mt-1">
            Welcome back, <span className="text-white font-semibold">{user?.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md shadow-red-600/30 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </Link>
          <Link
            to="/admin/skills"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Skill
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Projects Stat */}
        <Link
          to="/admin/projects"
          className="p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-red-500/40 hover:bg-[#181818] transition-all group"
        >
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Projects</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {isLoading ? '...' : stats.projectsCount}
          </div>
          <p className="text-xs text-white/40 mt-1">Manage public projects →</p>
        </Link>

        {/* Skills Stat */}
        <Link
          to="/admin/skills"
          className="p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-red-500/40 hover:bg-[#181818] transition-all group"
        >
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Skills</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {isLoading ? '...' : stats.skillsCount}
          </div>
          <p className="text-xs text-white/40 mt-1">Manage technical skills →</p>
        </Link>

        {/* Experience Stat */}
        <Link
          to="/admin/experience"
          className="p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-red-500/40 hover:bg-[#181818] transition-all group"
        >
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Experience</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {isLoading ? '...' : stats.experienceCount}
          </div>
          <p className="text-xs text-white/40 mt-1">Manage work history →</p>
        </Link>

        {/* Certificates Stat */}
        <Link
          to="/admin/certificates"
          className="p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-red-500/40 hover:bg-[#181818] transition-all group"
        >
          <div className="flex items-center justify-between text-white/50 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Certificates</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {isLoading ? '...' : stats.certificatesCount}
          </div>
          <p className="text-xs text-white/40 mt-1">Manage certifications →</p>
        </Link>
      </div>

      {/* Middle section: Resume status & Recent projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resume Card */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Current Resume</h2>
              <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-mono uppercase font-bold border border-red-500/20">
                PDF
              </span>
            </div>
            {resume ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-white truncate">{resume.fileName || 'Resume.pdf'}</p>
                <p className="text-xs text-white/40">
                  {resume.updatedAt?.toDate ? `Updated ${resume.updatedAt.toDate().toLocaleDateString()}` : 'Uploaded'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-white/50">No resume uploaded in Firestore yet.</p>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <Link
              to="/admin/resume"
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              Manage Resume →
            </Link>
            {resume?.fileUrl && (
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
              >
                Preview PDF
              </a>
            )}
          </div>
        </div>

        {/* Recent Projects Preview */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#141414] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Recent Projects</h2>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              View All ({stats.projectsCount}) →
            </Link>
          </div>

          {isLoading ? (
            <p className="text-xs text-white/40 py-4">Loading projects...</p>
          ) : recentProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-white/50 mb-3">No projects found in Firestore.</p>
              <Link
                to="/admin/settings"
                className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 text-xs font-semibold inline-block transition-colors"
              >
                Seed Initial Data from Portfolio
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentProjects.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white truncate">{p.title}</h3>
                      {p.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold shrink-0">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 truncate max-w-md mt-0.5">
                      {p.shortDescription || p.description}
                    </p>
                  </div>
                  <Link
                    to="/admin/projects"
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
