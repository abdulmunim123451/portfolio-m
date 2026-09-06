import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { deleteFile } from './storage';

// ==========================================
// 1. PROJECTS
// ==========================================

export const getProjects = async () => {
  if (!isFirebaseConfigured() || !db) return [];
  try {
    const q = query(collection(db, 'projects'), orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const subscribeProjects = (callback) => {
  if (!isFirebaseConfigured() || !db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'projects'), orderBy('displayOrder', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(data);
    },
    (error) => {
      console.error('Error subscribing to projects:', error);
    }
  );
};

export const addProject = async (projectData) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  const cleanData = {
    title: projectData.title?.trim() || '',
    slug: projectData.slug?.trim() || (projectData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    shortDescription: projectData.shortDescription?.trim() || '',
    description: projectData.description?.trim() || '',
    imageUrl: projectData.imageUrl || '',
    imagePath: projectData.imagePath || '',
    githubUrl: projectData.githubUrl?.trim() || '',
    liveUrl: projectData.liveUrl?.trim() || '',
    technologies: Array.isArray(projectData.technologies) ? projectData.technologies : [],
    featured: Boolean(projectData.featured),
    displayOrder: Number(projectData.displayOrder) || 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'projects'), cleanData);
  return { id: docRef.id, ...cleanData };
};

export const updateProject = async (id, projectData) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  const docRef = doc(db, 'projects', id);
  const cleanData = {
    ...projectData,
    updatedAt: serverTimestamp(),
  };
  delete cleanData.id;
  await updateDoc(docRef, cleanData);
  return { id, ...cleanData };
};

export const deleteProject = async (id, imagePath = null) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  if (imagePath) {
    try {
      await deleteFile(imagePath);
    } catch (e) {
      console.warn('Could not delete project image:', e);
    }
  }
  await deleteDoc(doc(db, 'projects', id));
};

// ==========================================
// 2. SKILLS
// ==========================================

export const getSkills = async () => {
  if (!isFirebaseConfigured() || !db) return [];
  try {
    const q = query(collection(db, 'skills'), orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
};

export const subscribeSkills = (callback) => {
  if (!isFirebaseConfigured() || !db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'skills'), orderBy('displayOrder', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(data);
    },
    (error) => {
      console.error('Error subscribing to skills:', error);
    }
  );
};

export const addSkill = async (skillData) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  const cleanData = {
    name: skillData.name?.trim() || '',
    category: skillData.category?.trim() || 'General',
    iconUrl: skillData.iconUrl || '',
    iconPath: skillData.iconPath || '',
    level: Number(skillData.level) || 85,
    displayOrder: Number(skillData.displayOrder) || 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'skills'), cleanData);
  return { id: docRef.id, ...cleanData };
};

export const updateSkill = async (id, skillData) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  const docRef = doc(db, 'skills', id);
  const cleanData = {
    ...skillData,
    updatedAt: serverTimestamp(),
  };
  delete cleanData.id;
  await updateDoc(docRef, cleanData);
  return { id, ...cleanData };
};

export const deleteSkill = async (id, iconPath = null) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  if (iconPath) {
    try {
      await deleteFile(iconPath);
    } catch (e) {
      console.warn('Could not delete skill icon:', e);
    }
  }
  await deleteDoc(doc(db, 'skills', id));
};

// ==========================================
// 3. PROFILE / ABOUT
// ==========================================

export const getProfile = async () => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const docRef = doc(db, 'profile', 'main');
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const subscribeProfile = (callback) => {
  if (!isFirebaseConfigured() || !db) {
    callback(null);
    return () => {};
  }
  const docRef = doc(db, 'profile', 'main');
  return onSnapshot(
    docRef,
    (snap) => {
      callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    },
    (error) => {
      console.error('Error subscribing to profile:', error);
    }
  );
};

export const updateProfile = async (profileData) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  const docRef = doc(db, 'profile', 'main');
  const cleanData = {
    name: profileData.name?.trim() || '',
    headline: profileData.headline?.trim() || '',
    shortBio: profileData.shortBio?.trim() || '',
    aboutDescription: profileData.aboutDescription?.trim() || '',
    location: profileData.location?.trim() || '',
    email: profileData.email?.trim() || '',
    profileImageUrl: profileData.profileImageUrl || '',
    profileImagePath: profileData.profileImagePath || '',
    githubUrl: profileData.githubUrl?.trim() || '',
    linkedinUrl: profileData.linkedinUrl?.trim() || '',
    twitterUrl: profileData.twitterUrl?.trim() || '',
    instagramUrl: profileData.instagramUrl?.trim() || '',
    youtubeUrl: profileData.youtubeUrl?.trim() || '',
    websiteUrl: profileData.websiteUrl?.trim() || '',
    updatedAt: serverTimestamp(),
  };
  await setDoc(docRef, cleanData, { merge: true });
  return cleanData;
};

// ==========================================
// 4. EXPERIENCE
// ==========================================

export const getExperience = async () => {
  if (!isFirebaseConfigured() || !db) return [];
  try {
    const q = query(collection(db, 'experience'), orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching experience:', error);
    return [];
  }
};

export const subscribeExperience = (callback) => {
  if (!isFirebaseConfigured() || !db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'experience'), orderBy('displayOrder', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(data);
    },
    (error) => {
      console.error('Error subscribing to experience:', error);
    }
  );
};

export const addExperience = async (expData) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  const cleanData = {
    jobTitle: expData.jobTitle?.trim() || '',
    company: expData.company?.trim() || '',
    location: expData.location?.trim() || '',
    startDate: expData.startDate?.trim() || '',
    endDate: expData.endDate?.trim() || '',
    currentlyWorking: Boolean(expData.currentlyWorking),
    description: expData.description?.trim() || '',
    technologies: Array.isArray(expData.technologies) ? expData.technologies : [],
    displayOrder: Number(expData.displayOrder) || 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'experience'), cleanData);
  return { id: docRef.id, ...cleanData };
};

export const updateExperience = async (id, expData) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  const docRef = doc(db, 'experience', id);
  const cleanData = {
    ...expData,
    updatedAt: serverTimestamp(),
  };
  delete cleanData.id;
  await updateDoc(docRef, cleanData);
  return { id, ...cleanData };
};

export const deleteExperience = async (id) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  await deleteDoc(doc(db, 'experience', id));
};

// ==========================================
// 5. CERTIFICATES
// ==========================================

export const getCertificates = async () => {
  if (!isFirebaseConfigured() || !db) return [];
  try {
    const q = query(collection(db, 'certificates'), orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
};

export const subscribeCertificates = (callback) => {
  if (!isFirebaseConfigured() || !db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'certificates'), orderBy('displayOrder', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(data);
    },
    (error) => {
      console.error('Error subscribing to certificates:', error);
    }
  );
};

export const addCertificate = async (certData) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  const cleanData = {
    title: certData.title?.trim() || '',
    issuer: certData.issuer?.trim() || '',
    date: certData.date?.trim() || '',
    description: certData.description?.trim() || '',
    imageUrl: certData.imageUrl || '',
    imagePath: certData.imagePath || '',
    certificateUrl: certData.certificateUrl?.trim() || '',
    displayOrder: Number(certData.displayOrder) || 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'certificates'), cleanData);
  return { id: docRef.id, ...cleanData };
};

export const updateCertificate = async (id, certData) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  const docRef = doc(db, 'certificates', id);
  const cleanData = {
    ...certData,
    updatedAt: serverTimestamp(),
  };
  delete cleanData.id;
  await updateDoc(docRef, cleanData);
  return { id, ...cleanData };
};

export const deleteCertificate = async (id, imagePath = null) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  if (imagePath) {
    try {
      await deleteFile(imagePath);
    } catch (e) {
      console.warn('Could not delete certificate file:', e);
    }
  }
  await deleteDoc(doc(db, 'certificates', id));
};

// ==========================================
// 6. RESUME
// ==========================================

export const getResume = async () => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const docRef = doc(db, 'resume', 'main');
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error('Error fetching resume:', error);
    return null;
  }
};

export const subscribeResume = (callback) => {
  if (!isFirebaseConfigured() || !db) {
    callback(null);
    return () => {};
  }
  const docRef = doc(db, 'resume', 'main');
  return onSnapshot(
    docRef,
    (snap) => {
      callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    },
    (error) => {
      console.error('Error subscribing to resume:', error);
    }
  );
};

export const updateResume = async (resumeData) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  const docRef = doc(db, 'resume', 'main');
  const cleanData = {
    fileName: resumeData.fileName?.trim() || '',
    fileUrl: resumeData.fileUrl || '',
    storagePath: resumeData.storagePath || '',
    updatedAt: serverTimestamp(),
  };
  await setDoc(docRef, cleanData, { merge: true });
  return cleanData;
};

export const deleteResume = async (storagePath = null) => {
  if (!isFirebaseConfigured() || !db) throw new Error('Firebase is not configured');
  if (storagePath) {
    try {
      await deleteFile(storagePath);
    } catch (e) {
      console.warn('Could not delete resume storage file:', e);
    }
  }
  await deleteDoc(doc(db, 'resume', 'main'));
};

// ==========================================
// 7. SAFE NON-DESTRUCTIVE SEED OPERATION
// ==========================================

export const seedInitialData = async (initialData, { replaceExisting = false } = {}) => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase is not configured. Cannot perform seed.');
  }

  const results = {
    projectsAdded: 0,
    skillsAdded: 0,
    profileUpdated: false,
    experienceAdded: 0,
    certificatesAdded: 0,
    resumeUpdated: false,
    skippedCount: 0,
  };

  // 1. Profile / About
  const profileRef = doc(db, 'profile', 'main');
  const profileSnap = await getDoc(profileRef);
  if (!profileSnap.exists() || replaceExisting) {
    await setDoc(profileRef, {
      name: initialData.personalInfo?.name || 'Abdul Munim',
      headline: initialData.heroContent?.titleHighlight || 'Full Stack & Java Developer',
      shortBio: initialData.personalInfo?.summary || '',
      aboutDescription: initialData.aboutContent?.bio || '',
      location: initialData.personalInfo?.location || 'Bhopal, India',
      email: initialData.personalInfo?.emails?.primary || '',
      profileImageUrl: '',
      profileImagePath: '',
      githubUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
      instagramUrl: initialData.socialLinks?.instagram || '',
      youtubeUrl: '',
      websiteUrl: '',
      updatedAt: serverTimestamp(),
    });
    results.profileUpdated = true;
  } else {
    results.skippedCount++;
  }

  // 2. Resume
  const resumeRef = doc(db, 'resume', 'main');
  const resumeSnap = await getDoc(resumeRef);
  if (!resumeSnap.exists() || replaceExisting) {
    await setDoc(resumeRef, {
      fileName: 'Md_Yusuf_Resume_2026.pdf',
      fileUrl: initialData.personalInfo?.resumeUrl || '/Md_Yusuf_Resume_2026.pdf',
      storagePath: '',
      updatedAt: serverTimestamp(),
    });
    results.resumeUpdated = true;
  } else {
    results.skippedCount++;
  }

  // 3. Projects
  const existingProjects = await getProjects();
  const existingProjectTitles = new Set(existingProjects.map((p) => p.title.toLowerCase()));

  if (Array.isArray(initialData.projects)) {
    for (let i = 0; i < initialData.projects.length; i++) {
      const p = initialData.projects[i];
      if (!existingProjectTitles.has(p.title.toLowerCase()) || replaceExisting) {
        await addProject({
          title: p.title,
          slug: p.id || `project-${i + 1}`,
          shortDescription: p.badge || '',
          description: p.description || '',
          imageUrl: '',
          imagePath: '',
          githubUrl: '',
          liveUrl: p.links?.demo || p.links?.frontendDemo || '',
          technologies: p.techTags || [],
          featured: Boolean(p.isFlagship),
          displayOrder: i + 1,
        });
        results.projectsAdded++;
      } else {
        results.skippedCount++;
      }
    }
  }

  // 4. Skills
  const existingSkills = await getSkills();
  const existingSkillNames = new Set(existingSkills.map((s) => s.name.toLowerCase()));

  if (initialData.technicalSkills?.categories) {
    let orderCounter = 1;
    for (const cat of initialData.technicalSkills.categories) {
      if (Array.isArray(cat.skills)) {
        for (const s of cat.skills) {
          if (!existingSkillNames.has(s.name.toLowerCase()) || replaceExisting) {
            await addSkill({
              name: s.name,
              category: cat.title,
              level: s.level || 85,
              displayOrder: orderCounter++,
            });
            results.skillsAdded++;
          } else {
            results.skippedCount++;
          }
        }
      }
    }
  }

  // 5. Experience / Internships
  const existingExp = await getExperience();
  const existingExpKeys = new Set(existingExp.map((e) => `${e.company}-${e.jobTitle}`.toLowerCase()));

  if (Array.isArray(initialData.internshipsList)) {
    for (let i = 0; i < initialData.internshipsList.length; i++) {
      const item = initialData.internshipsList[i];
      const key = `${item.organization}-${item.role}`.toLowerCase();
      if (!existingExpKeys.has(key) || replaceExisting) {
        await addExperience({
          jobTitle: item.role || '',
          company: item.organization || '',
          location: '',
          startDate: item.duration || '',
          endDate: '',
          currentlyWorking: false,
          description: (item.skills || []).join(', '),
          technologies: item.tech || [],
          displayOrder: i + 1,
        });
        results.experienceAdded++;
      } else {
        results.skippedCount++;
      }
    }
  }

  // 6. Certificates
  const existingCerts = await getCertificates();
  const existingCertTitles = new Set(existingCerts.map((c) => c.title.toLowerCase()));

  if (Array.isArray(initialData.certificates?.featured)) {
    for (let i = 0; i < initialData.certificates.featured.length; i++) {
      const c = initialData.certificates.featured[i];
      if (!existingCertTitles.has(c.name.toLowerCase()) || replaceExisting) {
        await addCertificate({
          title: c.name,
          issuer: c.issuer,
          date: '',
          description: '',
          certificateUrl: initialData.certificates.viewAllUrl || '',
          displayOrder: i + 1,
        });
        results.certificatesAdded++;
      } else {
        results.skippedCount++;
      }
    }
  }

  return results;
};
