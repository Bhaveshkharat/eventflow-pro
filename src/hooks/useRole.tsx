"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Role } from "@/data/mock";

const Ctx = createContext<{ role: Role; setRole: (r: Role) => void }>({ role: "visitor", setRole: () => {} });

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("visitor");
  useEffect(() => {
    const r = (typeof localStorage !== "undefined" && localStorage.getItem("role")) as Role | null;
    if (r) setRoleState(r);
  }, []);
  const setRole = (r: Role) => { setRoleState(r); try { localStorage.setItem("role", r); } catch {} };
  return <Ctx.Provider value={{ role, setRole }}>{children}</Ctx.Provider>;
}
export const useRole = () => useContext(Ctx);
