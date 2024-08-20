"use client";

import dynamic from "next/dynamic";
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
import { Badge } from "@components/ui/badge";

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

import { useToast } from "@components/ui/use-toast";
import { protectedIdentityRemoveError } from "@lib/notifications";

import { LucidePersonStanding, Trash2 } from "lucide-react";
import IdentityModal from "@components/identities/identity-modal";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import NoIdentities from "@components/identities/no-identities";

const ReactJson = dynamic(() => import("react-json-view"), {
  ssr: false,
});

const IdentityCard = ({
  identity,
  activeIdentityName,
  onIdentitySelect,
}: {
  identity: {
    name: string;
    isInternetIdentity: boolean;
    internetIdentity: object;
  };
  activeIdentityName: string;
  onIdentitySelect: (identityName: string) => void;
}) => {
  const [showRenameIdentityDialog, setShowRenameIdentityDialog] =
    useState(false);
  const [showRemoveIdentityDialog, setShowRemoveIdentityDialog] =
    useState(false);
  const [showInternetIdentityDialog, setShowInternetIdentityDialog] =
    useState(false);

  const { toast } = useToast();

  const isProtectedIdentity = ["anonymous", "default"].includes(identity.name);
  const isActiveIdentity = identity.name === activeIdentityName;

  const removeIdentityForm = useForm<z.infer<typeof removeIdentityFormSchema>>({
    resolver: zodResolver(removeIdentityFormSchema),
    defaultValues: {
      identity_name: identity.name,
    },
  });

  const renameIdentityForm = useForm<z.infer<typeof renameIdentityFormSchema>>({
    resolver: zodResolver(renameIdentityFormSchema),
    defaultValues: {
      from_identity_name: identity.name,
    },
  });

  const handleRemoveClick = () => {
    if (isProtectedIdentity || isActiveIdentity) {
      toast(protectedIdentityRemoveError(identity.name));
      return;
    }
    setShowRemoveIdentityDialog(true);
  };

  const handleInternetIdentityRemove = async () => {
    await window.awesomeApi.manageIdentities("delete", {
      name: identity.name,
    });
    await window.awesomeApi.deleteKeyValue("baseKey");
    await window.awesomeApi.deleteKeyValue("delegation");
    await window.awesomeApi.reloadApplication();
  };

  const handleSelectIdentity = () => {
    onIdentitySelect(identity.name);
  };

  if (identity.name === "*") {
    return null;
  }

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
          <div className="flex flex-col space-y-1 overflow-hidden">
            <CardTitle className="text-medium">
              {identity.isInternetIdentity
                ? identity.name.slice(0, 11)
                : identity.name}
            </CardTitle>
            <CardDescription>
              {identity.isInternetIdentity
                ? "Internet Identity"
                : "Local Identity"}
            </CardDescription>
          </div>
          {isActiveIdentity ? (
            <Badge variant="secondary" className="ml-auto">
              Active
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="hover:text-red-500 ml-auto"
              onClick={handleRemoveClick}
              disabled={isProtectedIdentity}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {identity.isInternetIdentity ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowInternetIdentityDialog(true)}
          >
            Details
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowRenameIdentityDialog(true)}
            disabled={isProtectedIdentity}
          >
            Edit
          </Button>
        )}
        <Button
          className="w-full"
          onClick={handleSelectIdentity}
          disabled={isActiveIdentity}
          variant={isActiveIdentity ? "secondary" : "default"}
        >
          {isActiveIdentity ? "Active" : "Select"}
        </Button>
      </CardContent>
      <Dialog
        open={showInternetIdentityDialog}
        onOpenChange={() => setShowInternetIdentityDialog(false)}
      >
        <DialogContent>
          <DialogHeader className="space-y-3">
            <DialogTitle>Internet Identity Details</DialogTitle>
            <DialogDescription>
              You can view the details of an internet identity here.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <ReactJson name={identity.name} src={identity.internetIdentity} />
            <ScrollBar />
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowInternetIdentityDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showRenameIdentityDialog}
        onOpenChange={() => setShowRenameIdentityDialog(false)}
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
                  </div>
                  <div className="space-y-3">
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
                  type="button"
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
      <Dialog
        open={showRemoveIdentityDialog}
        onOpenChange={() => setShowRemoveIdentityDialog(false)}
      >
        <DialogContent>
          <Form {...removeIdentityForm}>
            <form
              onSubmit={removeIdentityForm.handleSubmit(
                onRemoveIdentityFormSubmit
              )}
            >
              <DialogHeader className="space-y-3">
                <DialogTitle>Remove "{identity.name}"</DialogTitle>
                <DialogDescription>
                  Identities are global. If you remove an identity, it will be
                  removed from dfx also!
                </DialogDescription>
              </DialogHeader>
              <div>
                <div className="py-4 pb-6">
                  <div className="space-y-3">
                    <FormField
                      control={removeIdentityForm.control}
                      name="identity_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-small">
                            Identity Name
                          </FormLabel>
                          {identity ? (
                            <FormControl>
                              <Input
                                {...field}
                                id="identity_name"
                                defaultValue={identity.name}
                                disabled
                              />
                            </FormControl>
                          ) : null}
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
                  type="button"
                  onClick={() => setShowRemoveIdentityDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="destructive">
                  Remove
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default function IdentitiesComponent() {
  const [showCreateIdentityDialog, setShowCreateIdentityDialog] =
    useState(false);
  const [identities, setIdentities] = useState<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIdentityName, setActiveIdentityName] = useState("");

  const { toast } = useToast();

  function deserializeInternetIdentity(serializedIdentity) {
    const identity = JSON.parse(serializedIdentity, (key, value) => {
      if (typeof value === "string" && /^\d+n$/.test(value)) {
        return BigInt(value.slice(0, -1));
      }
      return value;
    });

    if (identity.isInternetIdentity) {
      try {
        identity.internetIdentity = JSON.parse(
          identity.internetIdentity,
          (key, value) => {
            if (typeof value === "string" && /^\d+n$/.test(value)) {
              return BigInt(value.slice(0, -1));
            }
            return value;
          }
        );
      } catch (error) {
        console.error("Error deserializing internetIdentity", error);
      }
    }

    return identity;
  }

  async function checkIdentities() {
    try {
      await window.awesomeApi.refreshIdentities();
      const identities = await window.awesomeApi.manageIdentities("list", "");

      identities.forEach((identity) => {
        if (identity.isInternetIdentity) {
          identity.internetIdentity = deserializeInternetIdentity(
            identity.internetIdentity
          );
        }
      });

      setIdentities(identities);
    } catch (error) {
      console.log("Error invoking remote method:", error);
    }
  }

  async function checkCurrentIdentity() {
    try {
      const result = await window.awesomeApi.runDfxCommand(
        "identity",
        "whoami"
      );
      return result;
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleIdentitySelect = async (identityName: string) => {
    try {
      await window.awesomeApi.runDfxCommand("identity", "use", [identityName]);
      setActiveIdentityName(identityName);
      await window.awesomeApi.reloadApplication();
    } catch (error) {
      console.error("Error selecting identity:", error);
    }
  };

  useEffect(() => {
    const fetchActiveIdentity = async () => {
      const activeIdentity = await checkCurrentIdentity();
      if (activeIdentity) {
        setActiveIdentityName(activeIdentity);
      }
    };

    fetchActiveIdentity();
    checkIdentities();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-106px)]">
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
        <div className="flex-grow">
          <div className="my-6">
            <Input
              type="search"
              placeholder={`Search for an identity between ${identities.length} identities`}
              onChange={handleSearchChange}
              value={searchQuery}
            />
          </div>
          <ScrollArea className="h-[calc(100vh-300px)] overflow-y-auto">
            <div className="grid grid-cols-3 gap-8">
              {identities
                .filter((identity) =>
                  identity.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((identity) => (
                  <IdentityCard
                    key={identity.name}
                    identity={identity}
                    activeIdentityName={activeIdentityName}
                    onIdentitySelect={handleIdentitySelect}
                  />
                ))}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>
      ) : (
        <NoIdentities />
      )}
    </div>
  );
}
