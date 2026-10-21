"use client";

import ProfileCard from "@/components/settings/profile/ProfileCard";
import OrganizationAccessCard from "@/components/settings/profile/OrganizationAccessCard";
import { getMe, updateMe } from "@/lib/actions/user";
import { useActionState, useEffect, useState } from "react";
import { toast, Toaster } from "@/components/ui/toast";

export default function ProfilePage() {
  const [state, formAction, isPending] = useActionState(updateMe, null);
  const [initialValues, setInitialValues] = useState<Record<string, unknown>>(
    {},
  );

  useEffect(() => {
    async function fetchMe() {
      const me = await getMe();
      if (me.ok && me.data) {
        const user = me.data.user;
        setInitialValues({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          avatarId: user.avatarId,
        });
      }
    }
    fetchMe();
  }, []);

  useEffect(() => {
    if (!state) return;

    if (state.path) return;

    if (state.success) {
      toast.add({
        description: state.message,
        type: "success",
      });
    } else {
      toast.add({
        description: state.message,
        type: "error",
        priority: "high",
      });
    }
  }, [state]);

  return (
    <div className="flex-1 p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl tracking-tight">Profile</h2>
        </div>
        <ProfileCard
          formAction={formAction}
          isPending={isPending}
          errorPath={state?.path || null}
          errorMsg={state?.message || ""}
          values={state?.values || initialValues}
        />

        <div className="pt-7 space-y-4">
          <div>
            <h3 className="text-base tracking-tight">Organization access</h3>
          </div>
          <OrganizationAccessCard />
        </div>
      </div>
      <Toaster />
    </div>
  );
}

