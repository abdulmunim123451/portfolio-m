import React, { createContext, useContext, useState, useEffect } from 'react';
import * as staticData from '../data/portfolioData';
import {
  subscribeProjects,
  subscribeSkills,
  subscribeProfile,
  subscribeExperience,
  subscribeCertificates,
  subscribeResume,
} from '../firebase/firestore';
import { isFirebaseConfigured } from '../firebase/config';

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  // Initialize state with static data for instant, zero-flicker loading
  const [projects, setProjects] = useState(staticData.projects || []);
  const [skillsCategories, setSkillsCategories] = useState(
    staticData.technicalSkills?.categories || []
  );
  const [profile, setProfile] = useState({
    name: staticData.personalInfo?.name || 'Abdul Munim',
    brandName: staticData.personalInfo?.brandName || 'Abdul Munim',
    headline: staticData.heroContent?.titleHighlight || 'Full Stack & Java Developer',
    shortBio: staticData.personalInfo?.summary || '',
    aboutHeading: staticData.aboutContent?.heading || 'Hello!',
    aboutDescription: staticData.aboutContent?.bio || '',
    location: staticData.personalInfo?.location || 'Bhopal, India',
    email: staticData.personalInfo?.emails?.primary || 'abdulmunim1234512345@gmail.com',
    profileImageUrl: '',
    profileImagePath: '',
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    instagramUrl: staticData.socialLinks?.instagram || 'https://instagram.com/its_abdulmunim_',
    youtubeUrl: '',
    websiteUrl: '',
    resumeUrl: staticData.personalInfo?.resumeUrl || '/Md_Yusuf_Resume_2026.pdf',
  });
  const [experienceList, setExperienceList] = useState(
    staticData.internshipsList || []
  );
  const [certificatesList, setCertificatesList] = useState(
    staticData.certificates?.featured || []
  );
  const [resumeData, setResumeData] = useState({
    fileName: 'Md_Yusuf_Resume_2026.pdf',
    fileUrl: staticData.personalInfo?.resumeUrl || '/Md_Yusuf_Resume_2026.pdf',
  });

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    // 1. Subscribe to Projects
    const unsubProjects = subscribeProjects((firestoreProjects) => {
      if (firestoreProjects && firestoreProjects.length > 0) {
        const mapped = firestoreProjects.map((p, index) => ({
          id: p.id || p.slug || `proj-${index}`,
          number: String(p.displayOrder || index + 1).padStart(2, '0'),
          badge: p.shortDescription || (p.featured ? '🚀 Flagship Project' : null),
          title: p.title || '',
          description: p.description || '',
          imageUrl: p.imageUrl || '',
          techTags: Array.isArray(p.technologies) ? p.technologies : [],
          links: {
            demo: p.liveUrl || undefined,
            github: p.githubUrl || undefined,
            ...(p.liveUrl ? { frontendDemo: p.liveUrl } : {}),
          },
          isFlagship: Boolean(p.featured),
        }));
        setProjects(mapped);
      }
    });

    // 2. Subscribe to Skills
    const unsubSkills = subscribeSkills((firestoreSkills) => {
      if (firestoreSkills && firestoreSkills.length > 0) {
        // Group skills by category
        const categoryMap = {};
        firestoreSkills.forEach((s) => {
          const cat = s.category || 'General';
          if (!categoryMap[cat]) {
            categoryMap[cat] = [];
          }
          categoryMap[cat].push({
            name: s.name,
            level: Number(s.level) || 85,
            iconUrl: s.iconUrl || '',
          });
        });

        const categoriesArray = Object.keys(categoryMap).map((catName) => ({
          title: catName,
          skills: categoryMap[catName],
        }));
        setSkillsCategories(categoriesArray);
      }
    });

    // 3. Subscribe to Profile
    const unsubProfile = subscribeProfile((firestoreProfile) => {
      if (firestoreProfile) {
        setProfile((prev) => ({
          ...prev,
          name: firestoreProfile.name || prev.name,
          brandName: firestoreProfile.name || prev.brandName,
          headline: firestoreProfile.headline || prev.headline,
          shortBio: firestoreProfile.shortBio || prev.shortBio,
          aboutDescription: firestoreProfile.aboutDescription || prev.aboutDescription,
          location: firestoreProfile.location || prev.location,
          email: firestoreProfile.email || prev.email,
          profileImageUrl: firestoreProfile.profileImageUrl || prev.profileImageUrl,
          profileImagePath: firestoreProfile.profileImagePath || prev.profileImagePath,
          githubUrl: firestoreProfile.githubUrl || prev.githubUrl,
          linkedinUrl: firestoreProfile.linkedinUrl || prev.linkedinUrl,
          twitterUrl: firestoreProfile.twitterUrl || prev.twitterUrl,
          instagramUrl: firestoreProfile.instagramUrl || prev.instagramUrl,
          youtubeUrl: firestoreProfile.youtubeUrl || prev.youtubeUrl,
          websiteUrl: firestoreProfile.websiteUrl || prev.websiteUrl,
        }));
      }
    });

    // 4. Subscribe to Experience
    const unsubExperience = subscribeExperience((firestoreExp) => {
      if (firestoreExp && firestoreExp.length > 0) {
        const mapped = firestoreExp.map((e) => {
          let durationStr = e.startDate || '';
          if (e.currentlyWorking) {
            durationStr += (durationStr ? ' - ' : '') + 'Present';
          } else if (e.endDate) {
            durationStr += (durationStr ? ' - ' : '') + e.endDate;
          }
          return {
            organization: e.company || '',
            role: e.jobTitle || '',
            duration: durationStr || 'Experience',
            skills: typeof e.description === 'string'
              ? e.description.split(',').map((s) => s.trim()).filter(Boolean)
              : [],
            tech: Array.isArray(e.technologies) ? e.technologies : [],
          };
        });
        setExperienceList(mapped);
      }
    });

    // 5. Subscribe to Certificates
    const unsubCertificates = subscribeCertificates((firestoreCerts) => {
      if (firestoreCerts && firestoreCerts.length > 0) {
        const mapped = firestoreCerts.map((c) => ({
          name: c.title || '',
          issuer: c.issuer || '',
          icon: c.icon || '📜',
          imageUrl: c.imageUrl || '',
          certificateUrl: c.certificateUrl || '',
        }));
        setCertificatesList(mapped);
      }
    });

    // 6. Subscribe to Resume
    const unsubResume = subscribeResume((firestoreResume) => {
      if (firestoreResume && firestoreResume.fileUrl) {
        setResumeData({
          fileName: firestoreResume.fileName || 'Resume.pdf',
          fileUrl: firestoreResume.fileUrl,
        });
        setProfile((prev) => ({
          ...prev,
          resumeUrl: firestoreResume.fileUrl,
        }));
      }
    });

    return () => {
      unsubProjects();
      unsubSkills();
      unsubProfile();
      unsubExperience();
      unsubCertificates();
      unsubResume();
    };
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        skillsCategories,
        profile,
        experienceList,
        certificatesList,
        resumeData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioProvider');
  }
  return context;
};
