"use client";

import { useState } from "react";
import { deleteAccount } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteAccountButton({ email }: { email: string }) {
  const [confirmation, setConfirmation] = useState("");
  const matches = confirmation.trim().toLowerCase() === email.trim().toLowerCase();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive">
          Delete account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This permanently deletes your account and everything in it — every case, memory,
            argument, research note, document, and task. This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="delete-account-confirm">
            Type <span className="font-medium">{email}</span> to confirm
          </Label>
          <Input
            id="delete-account-confirm"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <form action={deleteAccount}>
            <Button type="submit" variant="destructive" disabled={!matches}>
              Delete account
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
