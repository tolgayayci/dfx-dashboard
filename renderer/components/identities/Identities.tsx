"use client";

import { useState, useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";

import { Avatar, AvatarImage } from "@components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  onRemoveIdentityFormSubmit,
  removeIdentityFormSchema,
} from "@components/identities/forms/removeIdentity";

import {
  onRenameIdentityFormSubmit,
  renameIdentityFormSchema,
} from "@components/identities/forms/renameIdentity";

import { LucidePersonStanding } from "lucide-react";
import IdentityModal from "@components/identities/identity-modal";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";

export default function IdentitiesComponent() {
  const [showCreateIdentityDialog, setShowCreateIdentityDialog] =
    useState(false);
  const [identities, setIdentities] = useState<any>();
  const [searchQuery, setSearchQuery] = useState("");

  const removeIdentityForm = useForm<z.infer<typeof removeIdentityFormSchema>>({
    resolver: zodResolver(removeIdentityFormSchema),
  });

  const renameIdentityForm = useForm<z.infer<typeof renameIdentityFormSchema>>({
    resolver: zodResolver(renameIdentityFormSchema),
  });

  async function checkIdentities() {
    try {
      const identities = await window.awesomeApi.manageIdentities("list", "");

      setIdentities(identities);
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  const handleSearchChange = (e: any) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const IdentityCard = ({
    identity,
  }: {
    identity: {
      name: string;
      isInternetIdentity: boolean;
      internetIdentityPrincipal: string;
    };
  }) => {
    const [showRenameIdentityDialog, setShowRenameIdentityDialog] =
      useState(false);

    return (
      <Card className="col-span-1" key={identity.name}>
        <CardHeader>
          <div className="flex items-center">
            <Avatar className="mr-4 h-10 w-10">
              <AvatarImage
                src={`https://avatar.vercel.sh/${identity.name}.png`}
                alt={identity.name}
              />
            </Avatar>
            <div className="flex flex-col space-y-1">
              <CardTitle className="text-medium">
                {identity.isInternetIdentity
                  ? identity.internetIdentityPrincipal.slice(0, 11)
                  : identity.name}
              </CardTitle>
              <CardDescription>
                {identity.isInternetIdentity
                  ? "Internet Identity"
                  : "Local Identity"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowRenameIdentityDialog(true)}
            disabled={identity.isInternetIdentity}
          >
            Edit
          </Button>
          <Dialog
            open={showRenameIdentityDialog}
            onOpenChange={setShowRenameIdentityDialog}
          >
            <DialogContent>
              <Form {...renameIdentityForm}>
                <form
                  onSubmit={renameIdentityForm.handleSubmit(
                    onRenameIdentityFormSubmit
                  )}
                >
                  <DialogHeader className="space-y-3">
                    <DialogTitle>Rename "{identity.name}"</DialogTitle>
                    <DialogDescription>
                      Identities are global. They are not confined to a specific
                      project context.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <div className="py-4 pb-6">
                      <div className="space-y-3">
                        <FormField
                          control={renameIdentityForm.control}
                          name="from_identity_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-small">
                                Current Identity Name
                              </FormLabel>
                              {identity ? (
                                <FormControl>
                                  <Input
                                    {...field}
                                    id="from_identity_name"
                                    defaultValue={identity.name}
                                    disabled
                                  />
                                </FormControl>
                              ) : null}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={renameIdentityForm.control}
                          name="to_identity_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-small">
                                New Identity Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  id="to_identity_name"
                                  placeholder="alice"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowRenameIdentityDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Rename</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          {/* <AlertDialog>
            <Form {...removeIdentityForm}>
              <form
                onSubmit={removeIdentityForm.handleSubmit(
                  onRemoveIdentityFormSubmit
                )}
              >
                <AlertDialogTrigger>
                  <Button>Remove</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure to remove "{identity.name}" ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction type="submit">
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </form>
            </Form>
          </AlertDialog> */}
        </CardContent>
      </Card>
    );
  };

  // Call checkIdentities when the component mounts
  useEffect(() => {
    checkIdentities();
  }, []);

  return (
    <div>
      <>
        <div className="flex items-center justify-between">
          <Alert className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <LucidePersonStanding className="h-5 w-5 mr-4" />
              <div>
                <AlertTitle>
                  You have {identities?.length ? identities?.length : "0"}{" "}
                  identities
                </AlertTitle>
                <AlertDescription>
                  You can add, remove, or edit your identities on this page.
                </AlertDescription>
              </div>
            </div>
            <Button onClick={() => setShowCreateIdentityDialog(true)}>
              Create New Identity
            </Button>
          </Alert>
          <IdentityModal
            showCreateIdentityDialog={showCreateIdentityDialog}
            setShowCreateIdentityDialog={setShowCreateIdentityDialog}
          />
        </div>

        {identities ? (
          <div>
            <div className="my-6">
              <Input
                type="search"
                placeholder={`${"=>"} Search for an identity between ${
                  identities.length
                } identities`}
                onChange={handleSearchChange}
                value={searchQuery}
              />
            </div>
            <ScrollArea className="max-h-[350px] overflow-y-auto">
              <div className="grid grid-cols-3 gap-6">
                {identities
                  .filter((identity) =>
                    identity.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((identity) => (
                    <IdentityCard
                      key={
                        identity.name
                          ? identity.name
                          : identity.internetIdentityPrincipal
                      }
                      identity={identity}
                    />
                  ))}
              </div>
              <ScrollBar />
            </ScrollArea>
          </div>
        ) : (
          <div>"No identities found"</div>
        )}
      </>
    </div>
  );
}
