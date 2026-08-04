"use client";

import { useId, useState } from "react";
import { updateAccountDetails } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AccountSection({ email }: { email: string }) {
  const uid = useId();
  const [editing, setEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;
  // A blank password field means "don't change it" — only block Save when a
  // password was actually entered but doesn't clear the bar yet.
  const passwordBlocksSave = password.length > 0 && (password.length < 6 || password !== confirmPassword);

  function stopEditing() {
    setEditing(false);
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <section className="flex flex-col gap-4 rounded-lg border p-4">
      <h2 className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Account</h2>
      <form action={updateAccountDetails} className="flex flex-col gap-4 border-t pt-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${uid}-email`}>Email</Label>
          <Input
            id={`${uid}-email`}
            name="email"
            type="email"
            required
            defaultValue={email}
            disabled={!editing}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`${uid}-password`}>New password</Label>
          <Input
            id={`${uid}-password`}
            name="password"
            type="password"
            minLength={6}
            autoComplete="new-password"
            disabled={!editing}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            placeholder="Leave blank to keep your current password"
          />
          <Label htmlFor={`${uid}-password-confirm`}>Confirm password</Label>
          <Input
            id={`${uid}-password-confirm`}
            type="password"
            minLength={6}
            autoComplete="new-password"
            disabled={!editing}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full"
          />
          {!passwordsMatch && <p className="text-destructive text-xs">Passwords don&apos;t match.</p>}
        </div>

        {editing ? (
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={stopEditing}>
              Cancel
            </Button>
            <Button type="submit" variant="outline" disabled={passwordBlocksSave}>
              Save
            </Button>
          </div>
        ) : (
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => setEditing(true)}>
              Edit
            </Button>
          </div>
        )}
      </form>
    </section>
  );
}
