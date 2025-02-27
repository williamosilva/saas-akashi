"use client";

import { usePathname, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import type React from "react";
import { AuthService } from "@/services/auth.service";
import { createContext, useContext } from "react";

const VALID_ROUTES = ["/", "/form", "/success"];

interface ProjectContextType {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  triggerReload: () => void;
  openCreateProjectModal: boolean;
  setOpenCreateProjectModal: (open: boolean) => void;
}

interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
  fullName: string | null;
  setFullName: (fullName: string | null) => void;
  photo: string | null;
  setPhoto: (photo: string | null) => void;
}
interface hookContext {
  openAuthModal: boolean;
  setOpenAuthModal: (open: boolean) => void;
  targetSection: string | null;
  setTargetSection: (section: string) => void;
}

export const UserContext = createContext<UserContextType>({
  userId: "",
  setUserId: () => {},
  email: "",
  setEmail: () => {},
  fullName: "",
  setFullName: () => {},
  photo: "",
  setPhoto: () => {},
});

export const ProjectContext = createContext<ProjectContextType>({
  selectedProjectId: null,
  setSelectedProjectId: () => {},
  triggerReload: () => {},
  openCreateProjectModal: false,
  setOpenCreateProjectModal: () => {},
});

export const HookContext = createContext<hookContext>({
  openAuthModal: false,
  setOpenAuthModal: () => {},
  targetSection: null,
  setTargetSection: () => {},
});

export const useUser = () => useContext(UserContext);
export const useProject = () => useContext(ProjectContext);
export const useHook = () => useContext(HookContext);

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);
  const authService = AuthService.getInstance();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
  const [sidebarSignal, setSidebarSignal] = useState(0);

  const isFormRoute = pathname.startsWith("/form");
  const isHome = pathname === "/";
  const isSuccessCallbackRoute = pathname.match(/^\/success\/[^\/]+$/);
  const isValidRoute =
    VALID_ROUTES.includes(pathname) || isSuccessCallbackRoute;

  useEffect(() => {
    console.log("targetSection", targetSection);
  }, [targetSection]);

  useEffect(() => {
    const validateAndLoadUser = async () => {
      console.log("caiu aqui");
      try {
        const accessToken = AuthService.getAccessToken();
        const refreshToken = AuthService.getRefreshToken();
        if (!accessToken || !refreshToken) {
          router.push("/");
          return;
        }
        const validToken = await authService.validateToken(accessToken);
        console.log("Token válido:", validToken);
        const newAccessToken = accessToken;

        const userData = await authService.getMe(newAccessToken);
        console.log("userData", userData);
        console.log("caiu aqui2");
        setUserId(userData.id);
        setEmail(userData.email);
        setFullName(userData.fullName);
        setPhoto(userData.photo || null);
      } catch (error) {
        console.error("Erro de autenticação:", error);
        handleLogout();
      } finally {
        setIsValidating(false);
        console.log("caiu aqui3");
      }
    };

    const handleLogout = () => {
      setUserId(null);
      setFullName(null);
      setPhoto(null);
      setEmail(null);
      AuthService.clearAuthData();
      router.push("/");
    };

    validateAndLoadUser();
  }, [pathname, router, authService, isHome, isValidRoute]);

  useEffect(() => {
    console.log("emaiul dentro do laoyut", email);
  }, [email]);

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isValidRoute) {
    return <>{children}</>;
  }

  const userContextValue = {
    userId,
    setUserId,
    email,
    setEmail,
    fullName,
    setFullName,
    photo,
    setPhoto,
  };

  const projectContextValue = {
    selectedProjectId,
    setSelectedProjectId: (id: string | null) => {
      setSelectedProjectId(id);
    },
    triggerReload: () => {
      setSidebarSignal((prev) => prev + 1);
    },
    openCreateProjectModal,
    setOpenCreateProjectModal: (open: boolean) => {
      setOpenCreateProjectModal(open);
    },
  };

  const hookContextValue = {
    openAuthModal,
    setOpenAuthModal,
    targetSection,
    setTargetSection,
  };

  return (
    <HookContext.Provider value={hookContextValue}>
      <UserContext.Provider value={userContextValue}>
        <ProjectContext.Provider value={projectContextValue}>
          {isFormRoute ? (
            <div className="flex h-auto lg:h-screen">
              <Sidebar
                selectedProjectId={selectedProjectId}
                onProjectSelect={setSelectedProjectId}
                signal={sidebarSignal}
                openCreateProjectModal={openCreateProjectModal}
                setOpenCreateProjectModal={setOpenCreateProjectModal}
              />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          ) : (
            <div className="flex flex-col min-h-screen">
              <Navbar
                openAuthModal={openAuthModal}
                setOpenAuthModal={setOpenAuthModal}
              />
              <main className="flex-1">{children}</main>
            </div>
          )}
        </ProjectContext.Provider>
      </UserContext.Provider>
    </HookContext.Provider>
  );
}
