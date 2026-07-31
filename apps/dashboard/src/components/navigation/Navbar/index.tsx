"use client";

import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserCogIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

import { signOut } from "@/actions/auth.actions";
import { Avatar } from "@/components/ui/Avatar";
import { Box } from "@/components/ui/Box";
import { Dropdown } from "@/components/ui/Dropdown";
import { SearchBar } from "@/components/ui/SearchBar";
import { useAuth } from "@/contexts/AuthContext";

import styles from "./styles.module.css";

export function Navbar() {
  const { user } = useAuth();
  const userName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : undefined;

  return (
    <Box
      as="nav"
      align="center"
      justify="between"
      gap={16}
      className={styles.navbar}
    >
      <Box align="center" className={styles.left}>
        <Link
          href="/dashboard"
          className={styles.logoLink}
          aria-label="Studio Sterenn"
        >
          <img src="/logo.svg" alt="Studio Sterenn" className={styles.logo} />
        </Link>
      </Box>

      <Box align="center" justify="center" className={styles.center}>
        <SearchBar
          size="sm"
          variant="secondary"
          placeholder="Rechercher"
          className={styles.searchInput}
        />
      </Box>

      <Box align="center" justify="end" className={styles.right}>
        <Dropdown trigger={<Avatar name={userName} />} align="end" rounded>
          <Dropdown.Item>
            <UserIcon size={16} aria-hidden />
            <span>{userName}</span>
          </Dropdown.Item>
          <Dropdown.Subsection
            label={
              <Box align="center" gap={8}>
                <SettingsIcon size={16} aria-hidden />
                <span>Paramètres</span>
              </Box>
            }
          >
            <Dropdown.Item>
              <UserCogIcon size={16} aria-hidden />
              Compte
            </Dropdown.Item>
            <Dropdown.Item>
              <CreditCardIcon size={16} aria-hidden />
              Facturation
            </Dropdown.Item>
          </Dropdown.Subsection>
          <Dropdown.Item variant="danger" onClick={signOut}>
            <LogOutIcon size={16} aria-hidden />
            Déconnexion
          </Dropdown.Item>
        </Dropdown>
      </Box>
    </Box>
  );
}
