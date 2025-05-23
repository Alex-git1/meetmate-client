'use client';

import React, { useEffect, useRef, useState } from "react";
import { IconLogo } from "../svg/icon-logo";
import { IconBell } from "../svg/icon-bell";
import { IconUserCircle } from "../svg/icon-user-circle";
import { IconBurger } from "../svg/icon-burger";
import { useModalStore } from '@/app/store/use-modal-store';
import { useAuthStore } from '@/app/store/use-auth-store';
import { colorPrimary } from "@/utils/utils";
import { UserInfoModal } from "../modals/user-info-modal";
import { AuthOptionsModal } from "../modals/auth-options-modal";
import { useSidebarStore } from "@/app/store/use-sidebar-store";
import { subscribe } from "@/app/services/subscribe";
import { Toaster } from "react-hot-toast";
import { useGetUserById } from "@/app/services/auth-services";

const Header = () => {
  const { isModalOpen, toggleModal } = useModalStore();
  const { user } = useAuthStore();
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const [notifications, setNotifications] = useState([]);
  
  const [isAuthOptionsOpen, setIsAuthOptionsOpen] = useState(false);

  const handleUserClick = () => {
    if (!user) {
      setIsAuthOptionsOpen(true);
    } else {
      toggleModal();
    }
  };

  const { toggleSidebar } = useSidebarStore();

  const handleToggleSidebar = () => {
    toggleSidebar();
  };
  
  const closeAuthOptions = () => {
    setIsAuthOptionsOpen(false);
  };

  const key: string = process.env.NEXT_PUBLIC_KEY || "";
  const cluster: string = process.env.NEXT_PUBLIC_CLUSTER || "";

  useEffect(() => {
    subscribe({ key, cluster, setNotifications, userId: user?.id || "" });
  }, []);

  return (
    <>
      <header>
        <section className="flex justify-between items-center p-3.5 border-b-2 border-gray-300">
          <div onClick={handleToggleSidebar} className="flex items-center space-x-2 cursor-pointer">
            <IconLogo color={colorPrimary} />
          </div>
          <div className="flex items-center space-x-4">
            <IconBell />
            <div className="relative">
              <button 
                ref={userButtonRef}
                onClick={handleUserClick} 
                className="focus:outline-none"
              >
                <IconUserCircle />
              </button>
              {isModalOpen && user && (
                <UserInfoModal
                  isOpen={isModalOpen}
                  buttonRef={userButtonRef}
                />
              )}
              {isAuthOptionsOpen && !user && (
                <AuthOptionsModal
                  isOpen={isAuthOptionsOpen}
                  buttonRef={userButtonRef}
                  onClose={closeAuthOptions}
                />
              )}
            </div>
            <button onClick={toggleSidebar} className="md:hidden focus:outline-none">
              <IconBurger />
            </button>
          </div>
        </section>
      </header>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </>
  );
};

export default Header;
