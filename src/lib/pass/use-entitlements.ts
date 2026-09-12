import { useEffect, useState } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { entitlementsOf, FREE_ENTITLEMENTS, type Entitlements } from "@/lib/pass/access";
import { getMembership } from "@/lib/server/membership";

export function usePassEntitlements(): Entitlements & { ready: boolean } {
  const { user, isPending } = useCurrentUserState();
  const [ent, setEnt] = useState<Entitlements>(FREE_ENTITLEMENTS);

  useEffect(() => {
    if (isPending || !user) {
      setEnt(FREE_ENTITLEMENTS);
      return;
    }
    void getMembership()
      .then((row) => setEnt(entitlementsOf(row)))
      .catch(() => setEnt(FREE_ENTITLEMENTS));
  }, [isPending, user]);

  return { ...ent, ready: !isPending };
}
