import React, { useState, useEffect } from "react";
import {
  Church,
  ShieldCheck,
  Sparkles,
  LogIn,
  X,
  HelpCircle,
  HelpCircle as QuestionIcon,
  RefreshCw,
  Eye,
  Info,
  Sliders,
  Trash2,
  Download,
  Bell,
  Lock,
  Shield,
  User as UserIcon,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

import {
  GeneralConfig,
  ChurchEvent,
  Sermon,
  Devotional,
  StaffMember,
  PastServiceGalleryItem,
  PrayerRequest,
  VisitorSignup,
  User,
  LoginHistoryEntry
} from "./types";

import {
  initialGeneralConfig,
  initialEvents,
  initialSermons,
  initialDevotionals,
  initialStaff,
  initialGallery
} from "./initialData";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CMSDashboard from "./components/CMSDashboard";
import {
  HomeView,
  AboutView,
  VisitView,
  SermonsView,
  EventsView,
  GiveView,
  ContactView
} from "./components/Pages";
import { siteStorage } from "./storage/siteStorage";

export default function App() {
  // Sync state from browser storage so any edits persist on static hosting.
  const [config, setConfig] = useState<GeneralConfig>(() => {
    const parsed = siteStorage.getJSON<GeneralConfig>("nw_config", initialGeneralConfig);
    if (parsed) {
      if (parsed.address === "13509 Lyndon B Johnson Fwy, Garland, TX 75041" || !parsed.address) {
        parsed.address = "13509 Lyndon B Johnson Fwy, Garland, TX 75041";
        parsed.googleMapsEmbedUrl = "https://maps.google.com/maps?q=13509%20Lyndon%20B%20Johnson%20Fwy,%20Garland,%20TX%2075041&t=&z=15&ie=UTF8&iwloc=&output=embed";
      }
      if (parsed.serviceTime !== "4:00PM") {
        parsed.serviceTime = "4:00PM";
        siteStorage.setJSON("nw_config", parsed);
      }
      if (!parsed.missionStatement || parsed.missionStatement.includes("God's Word") || parsed.missionStatement.includes("To create a hospitable")) {
        parsed.missionStatement = "Our mission is to awaken a generation to Christ by proclaiming the Gospel, reviving the Holy Spirit within believers, and raising passionate young people who live by spirit and truth, and bold service, we seek to impact the world and honor God wholeheartedly.";
        // Let's use the exact requested string:
        parsed.missionStatement = "Our mission is to awaken a generation to Christ by proclaiming the Gospel, reviving the Holy Spirit within believers, and raising passionate young people who live by God’s Word. Through prayer, worship in spirit and truth, and bold service, we seek to impact the world and honor God wholeheartedly.";
        siteStorage.setJSON("nw_config", parsed);
      }
      if (parsed.phone !== "(682) 412-5519") {
        parsed.phone = "(682) 412-5519";
        siteStorage.setJSON("nw_config", parsed);
      }
    }
    return parsed;
  });

  const [events, setEvents] = useState<ChurchEvent[]>(() => {
    return siteStorage.getJSON<ChurchEvent[]>("nw_events", initialEvents);
  });

  const [sermons, setSermons] = useState<Sermon[]>(() => {
    return siteStorage.getJSON<Sermon[]>("nw_sermons", initialSermons);
  });

  const [devotionals, setDevotionals] = useState<Devotional[]>(() => {
    return siteStorage.getJSON<Devotional[]>("nw_devotionals", initialDevotionals);
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    return siteStorage.getJSON<StaffMember[]>("nw_staff", initialStaff);
  });

  const [gallery, setGallery] = useState<PastServiceGalleryItem[]>(() => {
    return siteStorage.getJSON<PastServiceGalleryItem[]>("nw_gallery", initialGallery);
  });

  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(() => {
    return siteStorage.getJSON<PrayerRequest[]>("nw_prayers", []);
  });

  const [visitorSignups, setVisitorSignups] = useState<VisitorSignup[]>(() => {
    return siteStorage.getJSON<VisitorSignup[]>("nw_visitors", []);
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>("home");

  // Current logged in user (starts with null or cached admin session)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return siteStorage.getJSON<User | null>("nw_user", null);
  });

  // Admin inline edit toggler
  const [isAdminEditMode, setIsAdminEditMode] = useState<boolean>(false);

  // Modal displays
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isPlanVisitOpen, setIsPlanVisitOpen] = useState<boolean>(false);

  // Registered members database
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = siteStorage.getJSON<User[] | null>("nw_users_list3", null);
    if (saved) return saved;
    const defaultUsers: User[] = [
      {
        username: "CherishAgusionu",
        role: "admin",
        email: "cherishagusionu@yahoo.com",
        firstName: "Cherish",
        lastName: "Agusionu",
        phone: "3464467150",
        password: "Cherish12345"
      },
      {
        username: "member",
        role: "member",
        email: "member@newwine.org",
        firstName: "Rachel",
        lastName: "Choice",
        phone: "987-654-3210",
        password: "fellowship"
      }
    ];
    siteStorage.setJSON("nw_users_list3", defaultUsers);
    return defaultUsers;
  });

  // Login form values
  const [loginUsername, setLoginUsername] = useState<string>("CherishAgusionu");
  const [loginPassword, setLoginPassword] = useState<string>("Cherish12345");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Account settings states
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState<string>("profile");
  
  const [settingsFirstName, setSettingsFirstName] = useState<string>("");
  const [settingsLastName, setSettingsLastName] = useState<string>("");
  const [settingsEmail, setSettingsEmail] = useState<string>("");
  const [settingsPhone, setSettingsPhone] = useState<string>("");
  const [settingsProfilePic, setSettingsProfilePic] = useState<string>("");

  const [settingsPassword, setSettingsPassword] = useState<string>("");
  const [settingsConfirmPassword, setSettingsConfirmPassword] = useState<string>("");
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState<string | null>(null);
  const [securityErrorMsg, setSecurityErrorMsg] = useState<string | null>(null);

  const [cookieAnalytics, setCookieAnalytics] = useState<boolean>(false);
  const [cookieMarketing, setCookieMarketing] = useState<boolean>(false);

  const [notifNewsletter, setNotifNewsletter] = useState<boolean>(true);
  const [notifSystemUpdates, setNotifSystemUpdates] = useState<boolean>(true);
  const [notifPrayerCircle, setNotifPrayerCircle] = useState<boolean>(false);
  const [notifWeeklyDevos, setNotifWeeklyDevos] = useState<boolean>(true);
  const [notifSermonReleases, setNotifSermonReleases] = useState<boolean>(false);

  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [prefsSuccessMsg, setPrefsSuccessMsg] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);

  // Sign up state variables
  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);
  const [signUpFirstName, setSignUpFirstName] = useState<string>("");
  const [signUpLastName, setSignUpLastName] = useState<string>("");
  const [signUpPhone, setSignUpPhone] = useState<string>("");
  const [signUpEmail, setSignUpEmail] = useState<string>("");
  const [signUpUsername, setSignUpUsername] = useState<string>("");
  const [signUpPassword, setSignUpPassword] = useState<string>("");
  const [signUpError, setSignUpError] = useState<string | null>(null);

  // Verification state variables
  const [isVerificationStep, setIsVerificationStep] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [userInputCode, setUserInputCode] = useState<string>("");
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);

  // Sync registered users list to local storage
  useEffect(() => {
    siteStorage.setJSON("nw_users_list3", registeredUsers);
  }, [registeredUsers]);

  // Visitor planning modal state
  const [visitName, setVisitName] = useState<string>("");
  const [visitDate, setVisitDate] = useState<string>("");
  const [visitTime, setVisitTime] = useState<string>("10:00 AM AM Gathering");
  const [visitPlanSuccess, setVisitPlanSuccess] = useState<boolean>(false);

  // Trigger LocalStorage saves whenever states update
  useEffect(() => {
    siteStorage.setJSON("nw_config", config);
  }, [config]);

  useEffect(() => {
    siteStorage.setJSON("nw_events", events);
  }, [events]);

  useEffect(() => {
    siteStorage.setJSON("nw_sermons", sermons);
  }, [sermons]);

  useEffect(() => {
    siteStorage.setJSON("nw_devotionals", devotionals);
  }, [devotionals]);

  useEffect(() => {
    siteStorage.setJSON("nw_staff", staff);
  }, [staff]);

  useEffect(() => {
    siteStorage.setJSON("nw_gallery", gallery);
  }, [gallery]);

  useEffect(() => {
    siteStorage.setJSON("nw_prayers", prayerRequests);
  }, [prayerRequests]);

  useEffect(() => {
    siteStorage.setJSON("nw_visitors", visitorSignups);
  }, [visitorSignups]);

  useEffect(() => {
    if (currentUser) {
      siteStorage.setJSON("nw_user", currentUser);
    } else {
      siteStorage.removeItem("nw_user");
    }
  }, [currentUser]);

  // Methods to handle submits from Page components
  const handleAddPrayerRequest = (req: Partial<PrayerRequest>) => {
    const added: PrayerRequest = {
      id: `p-${Date.now()}`,
      name: req.name || "Anonymous Intercessor",
      email: req.email || "anonymous@newwine.org",
      request: req.request || "",
      isPrivate: req.isPrivate ?? false,
      dateSubmitted: new Date().toISOString().split("T")[0],
      status: "pending"
    };
    setPrayerRequests([added, ...prayerRequests]);
  };

  const handleAddVisitorSignup = (vis: Partial<VisitorSignup>) => {
    const added: VisitorSignup = {
      id: `vis-${Date.now()}`,
      name: vis.name || "Guest Visitor",
      email: vis.email || "",
      phone: vis.phone,
      interestAreas: vis.interestAreas || [],
      message: vis.message,
      dateSubmitted: new Date().toISOString().split("T")[0]
    };
    setVisitorSignups([added, ...visitorSignups]);
  };

  // Give online state updater
  const handleUpdateGivingAmount = (newAmount: number) => {
    setConfig({
      ...config,
      givingCurrentAmount: newAmount
    });
  };

  // Helper to record successful logins and initialize default settings
  const recordSuccessfulLogin = (user: User) => {
    // Generate new log entry
    const newEntry: LoginHistoryEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      device: navigator.userAgent.includes("Mobile") ? "Mobile Device (Safari/Chrome)" : "Desktop Computer (WebKit/Blink)",
      location: "San Jose, CA USA (IP Verified)",
      status: "Success"
    };

    // Ensure they have default historical logs for realism if none exist
    const historicalLogs = user.loginHistory || [
      {
        id: `log-prev-1`,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(),
        device: "Desktop Browser (Chrome/Windows)",
        location: "Dallas, TX USA",
        status: "Success"
      },
      {
        id: `log-prev-2`,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString(),
        device: "Mobile Smartphone (Safari/iOS)",
        location: "Houston, TX USA",
        status: "Success"
      }
    ];

    const updatedHistory = [newEntry, ...historicalLogs];
    
    // Default cookie states if not defined
    const cookiePrefs = user.cookiePreferences || {
      essential: true,
      analytics: false,
      marketing: false
    };

    // Default notification states if not defined
    const notificationPrefs = user.notificationPreferences || {
      emailNewsletter: true,
      emailSystemUpdates: true,
      emailPrayerCircle: false,
      pushWeeklyDevos: true,
      pushSermonReleases: false
    };

    const updatedUser: User = {
      ...user,
      cookiePreferences: cookiePrefs,
      notificationPreferences: notificationPrefs,
      loginHistory: updatedHistory
    };

    // Update in registeredUsers list and local storage
    setRegisteredUsers((prev) => {
      const newList = prev.map((u) => u.username.toLowerCase() === user.username.toLowerCase() ? updatedUser : u);
      siteStorage.setJSON("nw_users_list3", newList);
      return newList;
    });

    // Update in session state
    setCurrentUser(updatedUser);
  };

  // Perform client-side login using Username and Password
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const normUsername = loginUsername.trim().toLowerCase();
    const foundUser = registeredUsers.find(
      (u) => u.username.trim().toLowerCase() === normUsername
    );

    if (foundUser && foundUser.password === loginPassword) {
      recordSuccessfulLogin(foundUser);
      if (foundUser.role === "admin") {
        setIsAdminEditMode(true); // Automatically turn on editing capabilities for Admin
      } else {
        setIsAdminEditMode(false);
      }
      setIsLoginModalOpen(false);
      // Clean form inputs
      setLoginUsername("");
      setLoginPassword("");
    } else {
      setLoginError("Invalid Username or Password. Please try again.");
    }
  };

  // Submit Sign Up Form
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    // 1. Password minimum length check
    if (signUpPassword.length < 8) {
      setSignUpError("Password must be at least 8 characters minimum.");
      return;
    }

    // 2. Username uniqueness check (case-insensitive)
    const normUsername = signUpUsername.trim().toLowerCase();
    const usernameExists = registeredUsers.some(
      (u) => u.username.trim().toLowerCase() === normUsername
    );

    if (usernameExists) {
      setSignUpError(`The username "${signUpUsername}" is already taken. Please try another one.`);
      return;
    }

    // 3. Email format simple check
    if (!signUpEmail.includes("@")) {
      setSignUpError("Please enter a valid email address.");
      return;
    }

    // 4. Generate verification code (6-digit)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    // 5. Create pending user object
    const newUser: User = {
      username: signUpUsername.trim(),
      role: "member", // Sign ups are always member accounts
      email: signUpEmail.trim(),
      firstName: signUpFirstName.trim(),
      lastName: signUpLastName.trim(),
      phone: signUpPhone.trim(),
      password: signUpPassword,
      cookiePreferences: {
        essential: true,
        analytics: false,
        marketing: false
      },
      notificationPreferences: {
        emailNewsletter: true,
        emailSystemUpdates: true,
        emailPrayerCircle: false,
        pushWeeklyDevos: true,
        pushSermonReleases: false
      },
      loginHistory: []
    };

    setPendingUser(newUser);
    setIsVerificationStep(true);
  };

  // Submit Verification Code Form
  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    if (userInputCode.trim() === generatedCode) {
      // Success!
      setVerificationSuccess(true);
      if (pendingUser) {
        // Add to registered users list
        const updatedUsersList = [...registeredUsers, pendingUser];
        setRegisteredUsers(updatedUsersList);
        siteStorage.setJSON("nw_users_list3", updatedUsersList);

        // Automatically log them in & record logging history!
        recordSuccessfulLogin(pendingUser);
        setIsAdminEditMode(false); // Members don't edit
        
        // Show success and close modal
        setTimeout(() => {
          setIsLoginModalOpen(false);
          // Reset states
          setIsSignUpMode(false);
          setIsVerificationStep(false);
          setPendingUser(null);
          setGeneratedCode("");
          setUserInputCode("");
          setSignUpFirstName("");
          setSignUpLastName("");
          setSignUpPhone("");
          setSignUpEmail("");
          setSignUpUsername("");
          setSignUpPassword("");
          setVerificationSuccess(false);
        }, 2200);
      }
    } else {
      setSignUpError("Verification code is incorrect. Please double check the code provided above.");
    }
  };

   // Open settings modal and prepopulate active fields
  const handleOpenSettingsModal = () => {
    if (currentUser) {
      setSettingsFirstName(currentUser.firstName || "");
      setSettingsLastName(currentUser.lastName || "");
      setSettingsEmail(currentUser.email || "");
      setSettingsPhone(currentUser.phone || "");
      setSettingsProfilePic(currentUser.profilePic || "🕊️");
      
      setCookieAnalytics(currentUser.cookiePreferences?.analytics ?? false);
      setCookieMarketing(currentUser.cookiePreferences?.marketing ?? false);

      setNotifNewsletter(currentUser.notificationPreferences?.emailNewsletter ?? true);
      setNotifSystemUpdates(currentUser.notificationPreferences?.emailSystemUpdates ?? true);
      setNotifPrayerCircle(currentUser.notificationPreferences?.emailPrayerCircle ?? false);
      setNotifWeeklyDevos(currentUser.notificationPreferences?.pushWeeklyDevos ?? true);
      setNotifSermonReleases(currentUser.notificationPreferences?.pushSermonReleases ?? false);

      setSettingsPassword("");
      setSettingsConfirmPassword("");
      setSecuritySuccessMsg(null);
      setSecurityErrorMsg(null);
      setProfileSuccessMsg(null);
      setPrefsSuccessMsg(null);
      setIsConfirmingDelete(false);
      setSettingsActiveTab("profile");
      setIsSettingsModalOpen(true);
    }
  };

  // Action: Save profile info
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg(null);

    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      firstName: settingsFirstName.trim(),
      lastName: settingsLastName.trim(),
      email: settingsEmail.trim(),
      phone: settingsPhone.trim(),
      profilePic: settingsProfilePic
    };

    setRegisteredUsers((prev) => {
      const newList = prev.map((u) => u.username.toLowerCase() === currentUser.username.toLowerCase() ? updatedUser : u);
      siteStorage.setJSON("nw_users_list3", newList);
      return newList;
    });
    setCurrentUser(updatedUser);
    setProfileSuccessMsg("Profile details updated successfully!");
    setTimeout(() => setProfileSuccessMsg(null), 3000);
  };

  // Action: Save Password Update
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityErrorMsg(null);
    setSecuritySuccessMsg(null);

    if (!currentUser) return;

    if (settingsPassword.length < 8) {
      setSecurityErrorMsg("Password must be at least 8 characters minimum.");
      return;
    }

    if (settingsPassword !== settingsConfirmPassword) {
      setSecurityErrorMsg("Passwords do not match.");
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      password: settingsPassword
    };

    setRegisteredUsers((prev) => {
      const newList = prev.map((u) => u.username.toLowerCase() === currentUser.username.toLowerCase() ? updatedUser : u);
      siteStorage.setJSON("nw_users_list3", newList);
      return newList;
    });
    setCurrentUser(updatedUser);
    setSettingsPassword("");
    setSettingsConfirmPassword("");
    setSecuritySuccessMsg("Password updated successfully!");
    setTimeout(() => setSecuritySuccessMsg(null), 3500);
  };

  // Action: Save email settings and cookie updates 
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefsSuccessMsg(null);

    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      cookiePreferences: {
        essential: true,
        analytics: cookieAnalytics,
        marketing: cookieMarketing
      },
      notificationPreferences: {
        emailNewsletter: notifNewsletter,
        emailSystemUpdates: notifSystemUpdates,
        emailPrayerCircle: notifPrayerCircle,
        pushWeeklyDevos: notifWeeklyDevos,
        pushSermonReleases: notifSermonReleases
      }
    };

    setRegisteredUsers((prev) => {
      const newList = prev.map((u) => u.username.toLowerCase() === currentUser.username.toLowerCase() ? updatedUser : u);
      siteStorage.setJSON("nw_users_list3", newList);
      return newList;
    });
    setCurrentUser(updatedUser);
    setPrefsSuccessMsg("Preferences & privacy settings saved successfully!");
    setTimeout(() => setPrefsSuccessMsg(null), 3000);
  };

  // Action: Delete/Deactivate user account fully 
  const executeAccountDeletion = () => {
    if (!currentUser) return;
    const userToDelete = currentUser.username;

    // Filter out of registeredUsers
    setRegisteredUsers((prev) => {
      const filtered = prev.filter((u) => u.username.toLowerCase() !== userToDelete.toLowerCase());
      siteStorage.setJSON("nw_users_list3", filtered);
      return filtered;
    });

    // Logout and close modals
    setCurrentUser(null);
    setIsAdminEditMode(false);
    setIsSettingsModalOpen(false);
  };

  // Action: Download personal JSON data profile 
  const handleDownloadPersonalData = () => {
    if (!currentUser) return;

    const dataCopy = {
      app: "We Are New Wine Portal",
      timestamp: new Date().toISOString(),
      profile: {
        username: currentUser.username,
        role: currentUser.role,
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email,
        phone: currentUser.phone || ""
      },
      cookiePreferences: currentUser.cookiePreferences || {
        essential: true,
        analytics: false,
        marketing: false
      },
      notificationPreferences: currentUser.notificationPreferences || {
        emailNewsletter: true,
        emailSystemUpdates: true,
        emailPrayerCircle: false,
        pushWeeklyDevos: true,
        pushSermonReleases: false
      },
      loginHistory: currentUser.loginHistory || []
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataCopy, null, 2)
    )}`;
    
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `newwine_data_${currentUser.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePlanVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitName || !visitDate) return;
    
    // Auto-record as visitor connect as well!
    handleAddVisitorSignup({
      name: visitName,
      email: `${visitName.toLowerCase().replace(/\s+/g, "")}@example.com`,
      interestAreas: ["general"],
      message: `Planned Sunday visit on ${visitDate} during ${visitTime}.`
    });

    setVisitPlanSuccess(true);
    setTimeout(() => {
      setIsPlanVisitOpen(false);
      setVisitPlanSuccess(false);
      setVisitName("");
      setVisitDate("");
    }, 4500);
  };

  // Quick action to reset all custom database overrides back to default church templates
  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to restore the website back to its original default New Wine church template content? All visitor signups and prayer logs will be empty.")) {
      setConfig(initialGeneralConfig);
      setEvents(initialEvents);
      setSermons(initialSermons);
      setDevotionals(initialDevotionals);
      setStaff(initialStaff);
      setGallery(initialGallery);
      setPrayerRequests([]);
      setVisitorSignups([]);
      setIsAdminEditMode(false);
      setCurrentUser(null);
      alert("Successfully restored defaults!");
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen text-brand-dark flex flex-col justify-between selection:bg-brand-beige selection:text-brand-dark font-sans">
      


      {/* Main App Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isAdminEditMode={isAdminEditMode}
        setIsAdminEditMode={setIsAdminEditMode}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenSettingsModal={handleOpenSettingsModal}
      />

      {/* Page Content Display Area */}
      <main id="main-content-display" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Render Page based on Tab ID */}
        {activeTab === "home" && (
          <HomeView
            config={config}
            sermons={sermons}
            devotionals={devotionals}
            events={events}
            setActiveTab={setActiveTab}
            onOpenPlanVisit={() => setIsPlanVisitOpen(true)}
          />
        )}

        {activeTab === "about" && (
          <AboutView config={config} staff={staff} gallery={gallery} />
        )}

        {activeTab === "visit" && (
          <VisitView config={config} onOpenPlanVisit={() => setIsPlanVisitOpen(true)} />
        )}

        {activeTab === "events" && (
          <EventsView events={events} />
        )}

        {activeTab === "give" && (
          <GiveView config={config} setGivingAmount={handleUpdateGivingAmount} />
        )}

        {activeTab === "contact" && (
          <ContactView
            config={config}
            onSubmitPrayer={handleAddPrayerRequest}
            onSubmitSignup={handleAddVisitorSignup}
          />
        )}

        {/* Central CMS Administration Panel - Automatically shown below the content if editing mode is toggled on! */}
        {isAdminEditMode && (
          <div id="cms-anchor-point" className="mt-20 pt-10 border-t-2 border-dashed border-stone-200">
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 text-stone-800 text-xs mb-6 flex justify-between items-center">
              <div>
                <strong>⚙️ Real-Time Administrator Control Board Active!</strong>
                <p className="text-stone-605 mt-0.5">Use the registry tables below to instantly add, override, or strike database values such as schedule logs, sermons, devotionals, and visitors signups sync copies.</p>
              </div>
              <button
                id="btn-close-edit-mode-top"
                onClick={() => setIsAdminEditMode(false)}
                className="bg-stone-900 text-white hover:bg-stone-850 px-3 py-1.5 font-bold uppercase tracking-wider rounded text-[10px]"
              >
                Close Control Panel
              </button>
            </div>

            <CMSDashboard
              config={config}
              setConfig={setConfig}
              events={events}
              setEvents={setEvents}
              sermons={sermons}
              setSermons={setSermons}
              devotionals={devotionals}
              setDevotionals={setDevotionals}
              staff={staff}
              setStaff={setStaff}
              prayerRequests={prayerRequests}
              setPrayerRequests={setPrayerRequests}
              visitorSignups={visitorSignups}
              setVisitorSignups={setVisitorSignups}
            />
          </div>
        )}
      </main>

      {/* Main Footer Component */}
      <Footer config={config} setActiveTab={setActiveTab} />

      {/* ==========================================
          MEMBER SIGN IN / REGISTRATION MODAL
          ========================================== */}
      {isLoginModalOpen && (
        <div id="auth-modal-overlay" className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            id="auth-modal-dialog" 
            className={`bg-white rounded-none border border-brand-border shadow-none w-full overflow-hidden transition-all duration-300 animate-scale-up text-left ${
              isSignUpMode && !isVerificationStep ? "max-w-md md:max-w-lg" : "max-w-md"
            }`}
          >
            <div className="bg-brand-dark p-6 text-white flex justify-between items-center border-b border-[#2C2C2C]">
              <div className="flex items-center gap-2">
                <Church className="w-5 h-5 text-brand-sage" />
                <span className="font-serif font-light text-base tracking-tight text-brand-beige">
                  {!isSignUpMode 
                    ? "Member Portal & Admin Sign In" 
                    : isVerificationStep 
                      ? "Verify Your Email Address" 
                      : "Create Member Account"
                  }
                </span>
              </div>
              <button
                id="btn-close-login-modal"
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setIsSignUpMode(false);
                  setIsVerificationStep(false);
                  setLoginError(null);
                  setSignUpError(null);
                }}
                className="text-[#8C8C8C] hover:text-white transition-colors cursor-pointer bg-transparent border-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CASE 1: NOT SIGN UP MODE - STANDARD LOGIN */}
            {!isSignUpMode ? (
              <form onSubmit={handleLoginSubmit} id="modal-form-login" className="p-6 space-y-4 font-light">
                <div className="bg-brand-beige p-4 rounded-none border border-[#E5E2DA] text-xs text-brand-dark leading-relaxed">
                  <strong>💡 Guest &amp; Admin Sign In Credentials:</strong>
                  <p className="mt-1 font-mono text-[10.5px]">
                    &bull; Admin Username: <code className="font-bold">CherishAgusionu</code> &bull; Password: <code className="font-bold">Cherish12345</code>
                  </p>
                  <p className="mt-1 font-mono text-[10.5px]">
                    &bull; Default Member: <code className="font-bold">member</code> &bull; Password: <code className="font-bold">fellowship</code>
                  </p>
                </div>

                {loginError && (
                  <div className="bg-[#FFECEC] text-[#801010] rounded-none p-3 text-xs border border-[#F0D0D0] font-mono">
                    ⚠ {loginError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">Username *</label>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full text-xs p-3 bg-brand-bg rounded-none border border-brand-border text-brand-dark tracking-wide font-mono focus:outline-none focus:border-brand-sage"
                    placeholder="e.g. admin or member"
                    id="login-form-username"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">Password *</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full text-xs p-3 bg-brand-bg rounded-none border border-brand-border text-brand-dark tracking-wide font-mono focus:outline-none focus:border-brand-sage"
                    placeholder="Enter your password"
                    id="login-form-passwd"
                  />
                </div>

                <button
                  id="btn-login-modal-submit"
                  type="submit"
                  className="w-full bg-brand-dark hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-widest py-4 border border-brand-dark rounded-none cursor-pointer transition-all mt-2"
                >
                  Log In
                </button>

                <div className="text-center pt-2 border-t border-brand-border/40 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUpMode(true);
                      setSignUpError(null);
                    }}
                    className="text-xs font-semibold text-brand-sage hover:text-brand-dark transition-colors cursor-pointer bg-transparent border-0 underline uppercase tracking-wider"
                  >
                    Don't have an account? Sign Up
                  </button>
                </div>
              </form>
            ) : (
              /* CASE 2: SIGN UP MODE - REGISTER & VERIFICATION */
              <div className="p-6">
                {signUpError && (
                  <div className="bg-[#FFECEC] text-[#801010] rounded-none p-3 text-xs border border-[#F0D0D0] font-mono mb-4">
                    ⚠ {signUpError}
                  </div>
                )}

                {/* SUB-CASE 2A: REGISTRATION FORM */}
                {!isVerificationStep ? (
                  <form onSubmit={handleSignUpSubmit} id="modal-form-signup" className="space-y-4 font-light">
                    <p className="text-stone-500 text-xs mb-4 leading-relaxed">
                      Register a member account to join the New Wine family and track updates.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">First Name *</label>
                        <input
                          type="text"
                          required
                          value={signUpFirstName}
                          onChange={(e) => setSignUpFirstName(e.target.value)}
                          className="w-full text-xs p-3 bg-brand-bg rounded-none border border-brand-border text-brand-dark tracking-wide focus:outline-none focus:border-brand-sage"
                          placeholder="First Name"
                          id="signup-first-name"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={signUpLastName}
                          onChange={(e) => setSignUpLastName(e.target.value)}
                          className="w-full text-xs p-3 bg-brand-bg rounded-none border border-brand-border text-brand-dark tracking-wide focus:outline-none focus:border-brand-sage"
                          placeholder="Last Name"
                          id="signup-last-name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={signUpPhone}
                          onChange={(e) => setSignUpPhone(e.target.value)}
                          className="w-full text-xs p-3 bg-brand-bg rounded-none border border-brand-border text-brand-dark tracking-wide focus:outline-none focus:border-brand-sage"
                          placeholder="e.g. 123-456-7890"
                          id="signup-phone"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          className="w-full text-xs p-3 bg-brand-bg rounded-none border border-brand-border text-brand-dark tracking-wide focus:outline-none focus:border-brand-sage"
                          placeholder="e.g. name@email.com"
                          id="signup-email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">Username *</label>
                          <span className="text-[9px] text-[#A6A299] font-mono italic">unique</span>
                        </div>
                        <input
                          type="text"
                          required
                          value={signUpUsername}
                          onChange={(e) => setSignUpUsername(e.target.value)}
                          className="w-full text-xs p-3 bg-brand-bg rounded-none border border-brand-border text-brand-dark tracking-wide font-mono focus:outline-none focus:border-brand-sage"
                          placeholder="Create username"
                          id="signup-username"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">Password *</label>
                          <span className="text-[9px] text-red-500 font-mono">(min 8 chars)</span>
                        </div>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          className={`w-full text-xs p-3 bg-brand-bg rounded-none border text-brand-dark tracking-wide focus:outline-none ${
                            signUpPassword && signUpPassword.length < 8 ? "border-red-400 focus:border-red-400" : "border-brand-border focus:border-brand-sage"
                          }`}
                          placeholder="At least 8 characters"
                          id="signup-password"
                        />
                      </div>
                    </div>

                    <button
                      id="btn-signup-submit"
                      type="submit"
                      className="w-full bg-brand-sage hover:bg-brand-sage-dark text-white font-mono text-xs font-bold uppercase tracking-widest py-4 rounded-none cursor-pointer transition-all mt-4"
                    >
                      Create Account &amp; Verify Email
                    </button>

                    <div className="text-center pt-2 border-t border-brand-border/40 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUpMode(false);
                          setSignUpError(null);
                        }}
                        className="text-xs font-semibold text-brand-dark hover:text-brand-sage transition-colors cursor-pointer bg-transparent border-0 underline uppercase tracking-wider"
                      >
                        Already have an account? Back to Login
                      </button>
                    </div>
                  </form>
                ) : (
                  /* SUB-CASE 2B: EMAIL VERIFICATION STEP */
                  <form onSubmit={handleVerifyCodeSubmit} id="modal-form-verification" className="space-y-4 font-light">
                    {/* Simulated inbox notification */}
                    <div className="bg-[#EBF5EE] text-[#1E5D32] rounded-none p-4 border border-[#D5EAD2] text-xs font-mono select-all select-none">
                      <div className="flex items-center gap-1 font-bold uppercase tracking-wider mb-1.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>Simulation Email Delivery</span>
                      </div>
                      <p className="leading-relaxed">
                        To: <span className="font-bold underline">{signUpEmail}</span>
                        <br />
                        Verification Security OTP: <span className="text-sm font-bold bg-[#D3EED0] px-2 py-0.5 rounded-sm select-all tracking-wider text-black">{generatedCode}</span>
                      </p>
                    </div>

                    <p className="text-stone-500 text-xs leading-relaxed">
                      Please enter the 6-digit verification code sent to your registered email above to verify your account credentials.
                    </p>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">Verification Code *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={userInputCode}
                        onChange={(e) => setUserInputCode(e.target.value)}
                        className="w-full text-center text-lg tracking-[0.4em] font-mono p-3 bg-brand-bg rounded-none border border-brand-border text-brand-dark focus:outline-none focus:border-brand-sage"
                        placeholder="e.g. 123456"
                        id="verification-code-input"
                      />
                    </div>

                    {verificationSuccess && (
                      <div className="bg-[#E8F8F5] text-[#117864] text-xs p-3 font-mono border border-[#D1F2EB] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#117864]" />
                        <span>✨ Account activated! Welcome, {pendingUser?.firstName}! Logging you in...</span>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsVerificationStep(false);
                          setUserInputCode("");
                          setSignUpError(null);
                        }}
                        className="w-1/3 text-xs py-3 border border-[#CCCCCC] font-mono font-bold uppercase tracking-wider hover:bg-stone-50 cursor-pointer bg-white text-[#5A5A5A]"
                      >
                        Back
                      </button>

                      <button
                        id="btn-verify-submit"
                        type="submit"
                        disabled={verificationSuccess}
                        className="w-2/3 bg-brand-dark hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-widest py-3 border border-brand-dark rounded-none cursor-pointer transition-all flex items-center justify-center gap-2 disabled:bg-stone-400 disabled:border-stone-400"
                      >
                        Confirm Verification
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          ACCOUNT SETTINGS & PREFERENCES MODAL
          ========================================== */}
      {isSettingsModalOpen && currentUser && (
        <div id="settings-modal-overlay" className="fixed inset-0 z-50 bg-[#1A1A1A]/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div id="settings-modal-dialog" className="bg-white rounded-none border border-brand-border shadow-2xl max-w-4xl w-full flex flex-col md:flex-row h-auto md:h-[620px] overflow-hidden animate-scale-up text-left">
            
            {/* Modal Navigation Sidebar */}
            <div className="w-full md:w-64 bg-brand-dark p-6 text-white flex flex-col justify-between border-r border-[#2C2C2C]">
              <div>
                <div className="flex items-center gap-2 mb-8 pb-4 border-b border-stone-800">
                  <Sliders className="w-5 h-5 text-brand-sage" />
                  <div>
                    <h3 className="font-serif font-light text-base text-brand-beige leading-tight">Account Settings</h3>
                    <p className="text-[9px] text-[#8C8C8C] font-mono uppercase tracking-wider">{currentUser.username}</p>
                  </div>
                </div>

                <nav className="space-y-1" id="settings-tabs-nav">
                  <button
                    id="tab-btn-profile"
                    onClick={() => {
                      setSettingsActiveTab("profile");
                      setProfileSuccessMsg(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-all font-mono text-[11px] uppercase tracking-wider rounded-none cursor-pointer border-l-2 ${
                      settingsActiveTab === "profile"
                        ? "bg-[#292929] text-brand-beige border-brand-sage font-bold"
                        : "text-[#8C8C8C] hover:text-white hover:bg-[#202020] border-transparent"
                    }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Profile &amp; Details</span>
                  </button>

                  <button
                    id="tab-btn-security"
                    onClick={() => {
                      setSettingsActiveTab("security");
                      setSecuritySuccessMsg(null);
                      setSecurityErrorMsg(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-all font-mono text-[11px] uppercase tracking-wider rounded-none cursor-pointer border-l-2 ${
                      settingsActiveTab === "security"
                        ? "bg-[#292929] text-brand-beige border-brand-sage font-bold"
                        : "text-[#8C8C8C] hover:text-white hover:bg-[#202020] border-transparent"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Security &amp; Privacy</span>
                  </button>

                  <button
                    id="tab-btn-notifications"
                    onClick={() => {
                      setSettingsActiveTab("notifications");
                      setPrefsSuccessMsg(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-all font-mono text-[11px] uppercase tracking-wider rounded-none cursor-pointer border-l-2 ${
                      settingsActiveTab === "notifications"
                        ? "bg-[#292929] text-brand-beige border-brand-sage font-bold"
                        : "text-[#8C8C8C] hover:text-white hover:bg-[#202020] border-transparent"
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </button>

                  <button
                    id="tab-btn-management"
                    onClick={() => {
                      setSettingsActiveTab("management");
                      setIsConfirmingDelete(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-all font-mono text-[11px] uppercase tracking-wider rounded-none cursor-pointer border-l-2 ${
                      settingsActiveTab === "management"
                        ? "bg-[#292929] text-brand-beige border-brand-sage font-bold"
                        : "text-[#8C8C8C] hover:text-white hover:bg-[#202020] border-transparent"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Account Admin</span>
                  </button>
                </nav>
              </div>

              {/* Close / Return to Site CTA */}
              <button
                id="btn-settings-close-left"
                onClick={() => setIsSettingsModalOpen(false)}
                className="mt-8 md:mt-0 w-full py-2.5 bg-brand-sage hover:bg-brand-sage-dark text-white font-mono text-[10px] uppercase font-bold tracking-widest cursor-pointer text-center select-none"
              >
                Close Settings
              </button>
            </div>

            {/* Active Content Display Column */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-brand-bg">
                <div>
                  <h4 className="font-serif font-light text-lg text-brand-dark font-medium">
                    {settingsActiveTab === "profile" && "Profile & Personal Details"}
                    {settingsActiveTab === "security" && "Security & Privacy"}
                    {settingsActiveTab === "notifications" && "Notifications & Communications"}
                    {settingsActiveTab === "management" && "Account Management"}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                    {settingsActiveTab === "profile" && "Update your name and contact information."}
                    {settingsActiveTab === "security" && "Change your password, and manage cookie preferences."}
                    {settingsActiveTab === "notifications" && "Adjust email preferences, and push notifications."}
                    {settingsActiveTab === "management" && "Delete, deactivate, or download a copy of your personal data."}
                  </p>
                </div>
                <button
                  id="btn-close-settings-modal-top"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-950 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto font-sans text-xs text-stone-700 space-y-6">
                
                {/* 1. PROFILE DETAILS TAB */}
                {settingsActiveTab === "profile" && (
                  <form onSubmit={handleSaveProfile} className="space-y-5" id="form-settings-profile">
                    
                    {/* NAMES ROW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider font-mono">First Name *</label>
                        <input
                          type="text"
                          required
                          value={settingsFirstName}
                          onChange={(e) => setSettingsFirstName(e.target.value)}
                          className="w-full p-3 bg-brand-bg rounded-none border border-brand-border font-sans focus:outline-none focus:border-brand-sage text-stone-800"
                          id="settings-first-name"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider font-mono">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={settingsLastName}
                          onChange={(e) => setSettingsLastName(e.target.value)}
                          className="w-full p-3 bg-brand-bg rounded-none border border-brand-border font-sans focus:outline-none focus:border-brand-sage text-stone-800"
                          id="settings-last-name"
                        />
                      </div>
                    </div>

                    {/* CONTACT ROW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider font-mono">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={settingsEmail}
                          onChange={(e) => setSettingsEmail(e.target.value)}
                          className="w-full p-3 bg-brand-bg rounded-none border border-brand-border font-sans focus:outline-none focus:border-brand-sage text-stone-800"
                          id="settings-email"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider font-mono">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={settingsPhone}
                          onChange={(e) => setSettingsPhone(e.target.value)}
                          className="w-full p-3 bg-brand-bg rounded-none border border-brand-border font-sans focus:outline-none focus:border-brand-sage text-stone-800"
                          placeholder="123-456-7890"
                          id="settings-phone"
                        />
                      </div>
                    </div>

                    {profileSuccessMsg && (
                      <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2 font-mono text-[11px] animate-fade-in">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>{profileSuccessMsg}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      id="settings-profile-submit-btn"
                      className="bg-brand-sage hover:bg-brand-sage-dark text-white font-mono text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-none cursor-pointer transition-all shadow-sm"
                    >
                      Save Profile Details
                    </button>
                  </form>
                )}

                {/* 2. SECURITY & PRIVACY TAB */}
                {settingsActiveTab === "security" && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Password Update Form */}
                    <form onSubmit={handleSavePassword} className="space-y-4 pb-6 border-b border-stone-100">
                      <h5 className="text-xs uppercase font-bold text-stone-800 tracking-wider font-mono">Change Account Password</h5>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider font-mono">New Passphrase *</label>
                          <input
                            type="password"
                            required
                            minLength={8}
                            value={settingsPassword}
                            onChange={(e) => setSettingsPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className="w-full p-3 bg-brand-bg rounded-none border border-brand-border text-xs focus:outline-none focus:border-brand-sage text-stone-800 font-mono"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider font-mono">Confirm Passphrase *</label>
                          <input
                            type="password"
                            required
                            minLength={8}
                            value={settingsConfirmPassword}
                            onChange={(e) => setSettingsConfirmPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className="w-full p-3 bg-brand-bg rounded-none border border-brand-border text-xs focus:outline-none focus:border-brand-sage text-stone-800 font-mono"
                          />
                        </div>
                      </div>

                      {securityErrorMsg && (
                        <div className="p-3 bg-red-50 text-red-700 border border-red-200 font-mono text-[11px]">
                          ⚠ {securityErrorMsg}
                        </div>
                      )}

                      {securitySuccessMsg && (
                        <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2 font-mono text-[11px]">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>{securitySuccessMsg}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="bg-brand-dark hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-widest px-6 py-3 border border-brand-dark rounded-none cursor-pointer transition-all"
                      >
                        Update Credentials
                      </button>
                    </form>

                    {/* Cookie Consent Settings */}
                    <form onSubmit={handleSavePreferences} className="space-y-4">
                      <h5 className="text-xs uppercase font-bold text-stone-800 tracking-wider font-mono">Manage Cookie Preferences</h5>
                      <span className="text-[10px] text-stone-500 block leading-normal">
                        Control how cookie details tracking mechanisms are initialized on your local browser:
                      </span>

                      <div className="space-y-3 bg-brand-bg p-4 border border-brand-border">
                        {/* Essential Cookies */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-stone-800 text-[11px] uppercase font-mono tracking-wide leading-none block">1. Essential Application Session Keys (Required)</span>
                            <p className="text-[10px] text-stone-500 leading-normal">
                              Required to authenticate member portal identities, persist siteStorage tokens, and protect secure page transitions.
                            </p>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1">ALWAYS ON</span>
                        </div>

                        {/* Analytics Cookies */}
                        <div className="flex items-start justify-between gap-4 pt-3 border-t border-brand-border/40">
                          <div className="space-y-0.5">
                            <span className="font-bold text-stone-800 text-[11px] uppercase font-mono tracking-wide leading-none block">2. Performance &amp; Analytics Analytics Cookies</span>
                            <p className="text-[10px] text-stone-500 leading-normal">
                              Allows tracking page traffic stats, most-read devos columns, and loading times to measure technical health.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCookieAnalytics(!cookieAnalytics)}
                            className={`px-3 py-1 text-[10px] font-bold font-mono transition-colors rounded-none cursor-pointer uppercase ${
                              cookieAnalytics
                                ? "bg-brand-sage text-white font-bold"
                                : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                            }`}
                          >
                            {cookieAnalytics ? "Enabled" : "Disabled"}
                          </button>
                        </div>

                        {/* Marketing Cookies */}
                        <div className="flex items-start justify-between gap-4 pt-3 border-t border-brand-border/40">
                          <div className="space-y-0.5">
                            <span className="font-bold text-stone-800 text-[11px] uppercase font-mono tracking-wide leading-none block">3. Marketing &amp; Outreach Personalization</span>
                            <p className="text-[10px] text-stone-500 leading-normal">
                              Enables Christian network coordinates and sermon broadcast announcements tailored to regional member bases.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCookieMarketing(!cookieMarketing)}
                            className={`px-3 py-1 text-[10px] font-bold font-mono transition-colors rounded-none cursor-pointer uppercase ${
                              cookieMarketing
                                ? "bg-brand-sage text-white font-bold"
                                : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                            }`}
                          >
                            {cookieMarketing ? "Enabled" : "Disabled"}
                          </button>
                        </div>
                      </div>

                      {prefsSuccessMsg && (
                        <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2 font-mono text-[11px]">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>{prefsSuccessMsg}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="bg-stone-800 hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-none cursor-pointer transition-all server"
                      >
                        Save Privacy preferences
                      </button>
                    </form>

                    {/* Historical Login History Log */}
                    <div className="space-y-2 pt-4">
                      <h5 className="text-xs uppercase font-bold text-stone-800 tracking-wider font-mono">Your Authorized Login History</h5>
                      <p className="text-[10px] text-stone-500">
                        View active login records for your username credential signature:
                      </p>
                      
                      <div className="border border-stone-200 rounded-none overflow-hidden max-h-36 overflow-y-auto font-mono text-[10px]">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-brand-bg text-stone-500 border-b border-stone-200 text-[9px] uppercase">
                              <th className="p-2">Timestamp</th>
                              <th className="p-2">Device/Agent</th>
                              <th className="p-2">Location</th>
                              <th className="p-2 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentUser.loginHistory && currentUser.loginHistory.length > 0 ? (
                              currentUser.loginHistory.map((log) => (
                                <tr key={log.id} className="border-b border-stone-100 hover:bg-stone-50">
                                  <td className="p-2 text-stone-800">{log.timestamp}</td>
                                  <td className="p-2 text-stone-500 max-w-[150px] truncate" title={log.device}>{log.device}</td>
                                  <td className="p-2 text-stone-500">{log.location}</td>
                                  <td className="p-2 text-right text-emerald-600 font-bold">{log.status}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="p-3 text-center text-stone-400 italic">No available logging reports.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. NOTIFICATIONS TAB */}
                {settingsActiveTab === "notifications" && (
                  <form onSubmit={handleSavePreferences} className="space-y-6 animate-fade-in">
                    <div className="space-y-4">
                      <h5 className="text-xs uppercase font-bold text-stone-800 tracking-wider font-mono">Fellowship Email Preferences</h5>
                      <p className="text-[10px] text-stone-500">
                        Adjust what communications and newsletters are emailed to <span className="font-bold underline">{settingsEmail}</span>:
                      </p>

                      <div className="space-y-3 bg-brand-bg p-4 border border-brand-border">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={notifNewsletter}
                            onChange={(e) => setNotifNewsletter(e.target.checked)}
                            className="mt-0.5 w-4 h-4 text-brand-sage focus:ring-[#7C8363] border-brand-border rounded-none"
                          />
                          <div>
                            <span className="font-bold text-stone-800 text-[11px] uppercase font-mono tracking-wide leading-none block">Weekly Wine Newsletter &amp; Calendar</span>
                            <span className="text-[10px] text-stone-500 block mt-0.5">
                              Receive our weekly worship reviews, prayer needs list, and event bulletins.
                            </span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer select-none pt-3 border-t border-brand-border/40">
                          <input
                            type="checkbox"
                            checked={notifSystemUpdates}
                            onChange={(e) => setNotifSystemUpdates(e.target.checked)}
                            className="mt-0.5 w-4 h-4 text-brand-sage focus:ring-[#7C8363] border-brand-border rounded-none"
                          />
                          <div>
                            <span className="font-bold text-stone-800 text-[11px] uppercase font-mono tracking-wide leading-none block">System, Security, &amp; Administrative Alerts</span>
                            <span className="text-[10px] text-stone-500 block mt-0.5">
                              Crucial communications about login passkeys, verification code updates, or change requests.
                            </span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer select-none pt-3 border-t border-brand-border/40">
                          <input
                            type="checkbox"
                            checked={notifPrayerCircle}
                            onChange={(e) => setNotifPrayerCircle(e.target.checked)}
                            className="mt-0.5 w-4 h-4 text-brand-sage focus:ring-[#7C8363] border-brand-border rounded-none"
                          />
                          <div>
                            <span className="font-bold text-stone-800 text-[11px] uppercase font-mono tracking-wide block leading-none">Instant Prayer Request Circular Calls</span>
                            <span className="text-[10px] text-stone-500 block mt-0.5">
                              Instant email logs whenever a parishioner posts an online prayer request request.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-xs uppercase font-bold text-stone-800 tracking-wider font-mono">Mobile &amp; Web Push Notification Controls</h5>
                      <p className="text-[10px] text-stone-500">
                        Adjust direct system notifications dispatched to your active browser/device:
                      </p>

                      <div className="space-y-3 bg-brand-bg p-4 border border-brand-border">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={notifWeeklyDevos}
                            onChange={(e) => setNotifWeeklyDevos(e.target.checked)}
                            className="mt-0.5 w-4 h-4 text-brand-sage focus:ring-[#7C8363] border-brand-border rounded-none"
                          />
                          <div>
                            <span className="font-bold text-stone-800 text-[11px] uppercase font-mono tracking-wide leading-none block">Weekly Scripture Devotional Highlights</span>
                            <span className="text-[10px] text-stone-500 block mt-0.5">
                              Short notification prompts to keep you encouraged and feed your spiritual growth.
                            </span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer select-none pt-3 border-t border-brand-border/40">
                          <input
                            type="checkbox"
                            checked={notifSermonReleases}
                            onChange={(e) => setNotifSermonReleases(e.target.checked)}
                            className="mt-0.5 w-4 h-4 text-brand-sage focus:ring-[#7C8363] border-brand-border rounded-none"
                          />
                          <div>
                            <span className="font-bold text-stone-800 text-[11px] uppercase font-mono tracking-wide leading-none block">New Sermon Broadcast &amp; Ministry Releases</span>
                            <span className="text-[10px] text-stone-500 block mt-0.5">
                              Keep updated whenever pastor uploads study videos, audio podcasts, or live streams.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {prefsSuccessMsg && (
                      <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2 font-mono text-[11px]">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>{prefsSuccessMsg}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="bg-[#2C2C2C] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-none cursor-pointer transition-all"
                    >
                      Save Communication Preferences
                    </button>
                  </form>
                )}

                {/* 4. ACCOUNT MANAGEMENT TAB */}
                {settingsActiveTab === "management" && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* DOWNLOAD DATA CONTROL */}
                    <div className="p-5 border border-brand-border bg-brand-bg space-y-4">
                      <div className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-brand-dark" />
                        <h5 className="text-[11px] uppercase font-bold text-stone-800 tracking-wider font-mono">Download Personal Data archive</h5>
                      </div>
                      
                      <p className="text-[11px] text-stone-600 leading-normal">
                        You can download a complete backup of all profile information, security history records, email preferences, and settings stored in this web app session. The archive is formatted in a machine-readable JSON format for personal data compliance standards.
                      </p>

                      <button
                        type="button"
                        onClick={handleDownloadPersonalData}
                        className="bg-brand-dark hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-none cursor-pointer transition-all flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download JSON Data Backup</span>
                      </button>
                    </div>

                    {/* DEACTIVATE / DELETE */}
                    <div className="p-5 border border-red-200 bg-red-50/40 space-y-4">
                      <div className="flex items-center gap-2 text-red-850">
                        <AlertTriangle className="w-5 h-5 text-red-650 animate-pulse" />
                        <h5 className="text-[11px] uppercase font-bold tracking-wider font-mono text-red-800">Danger Zone: Purge Member Profile</h5>
                      </div>
                      
                      <p className="text-[11px] text-[#801010] leading-normal">
                        Deactivating or deleting this account will immediately revoke your access to the member worship portal dashboard, log you out of active browser contexts, and purge your custom stats. This action is permanently irreversible.
                      </p>

                      {!isConfirmingDelete ? (
                        <button
                          type="button"
                          onClick={() => setIsConfirmingDelete(true)}
                          className="bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-none cursor-pointer transition-all border border-red-700"
                        >
                          Delete Account Permanent Profile
                        </button>
                      ) : (
                        <div className="p-4 bg-[#FFECEC] border-l-4 border-red-600 text-xs space-y-3 animate-slide-in">
                          <p className="font-bold text-red-900 flex items-center gap-1">
                            <span>⚠️ Are you absolutely certain you want to purge your profile?</span>
                          </p>
                          <p className="text-[#801010] text-[10.5px]">
                            All stored credentials for <code className="font-bold bg-[#F9D5D5] px-1">{currentUser.username}</code> will be deleted from the registered members database.
                          </p>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setIsConfirmingDelete(false)}
                              className="px-4 py-2 border border-[#CCCCCC] font-mono font-bold text-stone-700 bg-white hover:bg-stone-50 cursor-pointer"
                            >
                              Cancel Operation
                            </button>
                            <button
                              type="button"
                              onClick={executeAccountDeletion}
                              className="px-4 py-2 bg-red-600 hover:bg-red-850 text-white font-mono font-bold uppercase tracking-wider cursor-pointer border border-red-700 font-bold"
                            >
                              Yes, Delete My Account
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          PLAN A SUNDAY VISIT MODAL
          ========================================== */}
      {isPlanVisitOpen && (
        <div id="visit-modal-overlay" className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div id="visit-modal-dialog" className="bg-white rounded-none border border-brand-border shadow-none max-w-md w-full overflow-hidden animate-scale-up text-left">
            <div className="bg-brand-dark p-6 text-white flex justify-between items-center border-b border-[#2C2C2C]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-sage" />
                <span className="font-serif font-light text-base tracking-tight text-brand-beige">Plan A Sunday Visit Log</span>
              </div>
              <button
                id="btn-close-visit-modal"
                onClick={() => setIsPlanVisitOpen(false)}
                className="text-[#8C8C8C] hover:text-white transition-colors cursor-pointer bg-transparent border-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlanVisitSubmit} id="modal-form-plan-visit" className="p-6 space-y-4 text-xs font-light">
              <p className="text-[#5A5A5A] font-sans leading-relaxed text-[11px]">
                Let us know you are coming!
              </p>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thomas cooper"
                  value={visitName}
                  onChange={(e) => setVisitName(e.target.value)}
                  className="w-full p-3 bg-brand-bg rounded-none border border-brand-border text-xs text-brand-dark focus:outline-none focus:border-brand-sage"
                  id="visit-modal-input-name"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">Estimated Sunday Date *</label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full p-3 bg-brand-bg rounded-none border border-brand-border text-xs text-brand-dark font-mono focus:outline-none focus:border-brand-sage"
                  id="visit-modal-input-date"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider font-mono">Preferred Service hour *</label>
                <select
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  className="w-full p-3 bg-brand-bg rounded-none border border-brand-border text-xs text-brand-dark focus:outline-none focus:border-brand-sage cursor-pointer"
                  id="visit-modal-select-time"
                >
                  <option value="10:00 AM Morning Gathering">10:00 AM Morning Gathering</option>
                  <option value="6:00 PM Evening Gathering">6:00 PM Evening Gathering</option>
                </select>
              </div>

              {visitPlanSuccess && (
                <div className="bg-[#7C8363]/10 text-[#3D4030] rounded-none p-4 font-mono text-[11px] border border-[#7C8363]/20 whitespace-pre-wrap select-text animate-fade-in">
                  ✨ Visit Confirmed!
                </div>
              )}

              <button
                id="btn-visit-modal-submit"
                type="submit"
                className="w-full bg-brand-dark hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-widest py-4 border border-brand-dark rounded-none cursor-pointer transition-all"
              >
                Lock Visitor Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
