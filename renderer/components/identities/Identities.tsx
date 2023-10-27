"use client";

import { useState, useEffect } from "react";

import {
  Form,
  FormControl,
  FormDescription,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Checkbox } from "@components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  onNewIdentityFormSubmit,
  newIdentityFormSchema,
} from "@components/identities/forms/createNewIdentity";

import {
  importIdentityFormSchema,
  onimportIdentityFormSubmit,
} from "@components/identities/forms/importNewIdentity";

import {
  onRemoveIdentityFormSubmit,
  removeIdentityFormSchema,
} from "@components/identities/forms/removeIdentity";

import {
  onRenameIdentityFormSubmit,
  renameIdentityFormSchema,
} from "@components/identities/forms/renameIdentity";

import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

import { LucidePersonStanding } from "lucide-react";

export default function IdentitiesComponent() {
  const [showCreateIdentityDialog, setShowCreateIdentityDialog] =
    useState(false);
  const [showRenameIdentityDialog, setShowRenameIdentityDialog] =
    useState(false);

  const [identities, setIdentities] = useState<string[]>();

  const newIdentityForm = useForm<z.infer<typeof newIdentityFormSchema>>({
    resolver: zodResolver(newIdentityFormSchema),
  });

  const importIdentityForm = useForm<z.infer<typeof importIdentityFormSchema>>({
    resolver: zodResolver(importIdentityFormSchema),
  });

  const removeIdentityForm = useForm<z.infer<typeof removeIdentityFormSchema>>({
    resolver: zodResolver(removeIdentityFormSchema),
  });

  const renameIdentityForm = useForm<z.infer<typeof renameIdentityFormSchema>>({
    resolver: zodResolver(renameIdentityFormSchema),
  });

  async function checkIdentities() {
    try {
      const result = await window.awesomeApi.runDfxCommand("identity", "list");

      // Split the input string into an array of identities
      const identities = result
        .split("\n")
        .filter((identity) => identity.trim() !== "");

      // Update the "Identities" group with the identities directly
      setIdentities(identities);
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  }

  const identityCard = (identity: string) => {
    return (
      <Card className="col-span-1" key={identity}>
        <CardHeader>
          <CardTitle>{identity}</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowRenameIdentityDialog(true)}
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
                    <DialogTitle>Rename "{identity}"</DialogTitle>
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
                              <FormControl>
                                <Input
                                  {...field}
                                  id="from_identity_name"
                                  defaultValue={identity}
                                  disabled
                                />
                              </FormControl>
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
                    <Button type="submit">Create</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Form {...removeIdentityForm}>
            <form
              onSubmit={removeIdentityForm.handleSubmit(
                onRemoveIdentityFormSubmit
              )}
            >
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button className="w-full">Remove</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure to remove "{identity}" ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button type="submit">Continue</Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>
          </Form>
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
      {identities ? (
        <>
          <div className="flex items-center justify-between">
            <Alert>
              <div className="flex items-center">
                <LucidePersonStanding className="h-5 w-5 mr-4" />
                <div>
                  <AlertTitle>
                    You have {identities.length} identities
                  </AlertTitle>
                  <AlertDescription>
                    You can add, remove, or edit your identities on this page.
                  </AlertDescription>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setShowCreateIdentityDialog(true)}>
                  Create New Identity
                </Button>
              </div>
            </Alert>
            <Dialog open={showCreateIdentityDialog}>
              <DialogContent>
                <Tabs defaultValue="new-identity">
                  <TabsList className="mb-4">
                    <TabsTrigger value="new-identity">New Identity</TabsTrigger>
                    <TabsTrigger value="import">Import Existing</TabsTrigger>
                  </TabsList>
                  <TabsContent value="new-identity">
                    <Form {...newIdentityForm}>
                      <form
                        onSubmit={newIdentityForm.handleSubmit(
                          onNewIdentityFormSubmit
                        )}
                      >
                        <DialogHeader className="space-y-3">
                          <DialogTitle>Create New Identity</DialogTitle>
                          <DialogDescription>
                            Identities you will add are global. They are not
                            confined to a specific project context.
                          </DialogDescription>
                        </DialogHeader>
                        <div>
                          <div className="py-4 pb-6">
                            <div className="space-y-3">
                              <FormField
                                control={newIdentityForm.control}
                                name="identity_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-small">
                                      Identity Name
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        id="identity_name"
                                        placeholder="alice"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Accordion type="single" collapsible>
                              <AccordionItem value="item-1">
                                <AccordionTrigger>Options</AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-4">
                                    <div className="space-y-3">
                                      <FormField
                                        control={newIdentityForm.control}
                                        name="hsm_key_id"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-small">
                                              HSM Key Id (Optional)
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                {...field}
                                                id="hsm_key_id"
                                                placeholder="xxxx"
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <FormField
                                        control={newIdentityForm.control}
                                        name="hsm_pkcs11_lib_path"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-small">
                                              opensc-pkcs11 Lib Path (Optional)
                                            </FormLabel>
                                            <FormControl>
                                              <div className="flex w-full items-center space-x-2">
                                                <Input
                                                  type="text"
                                                  readOnly
                                                  value={field.value}
                                                />
                                                <Button
                                                  onClick={() => {
                                                    // getDirectoryPath().then(
                                                    //   (path) => {
                                                    //     if (path) {
                                                    //       field.onChange(path);
                                                    //     }
                                                    //   }
                                                    // );
                                                  }}
                                                >
                                                  Select
                                                </Button>
                                              </div>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <FormField
                                        control={newIdentityForm.control}
                                        name="storage_mode"
                                        render={({ field }) => (
                                          <FormItem className="space-y-3">
                                            <FormLabel>
                                              Storage Mode (Optional)
                                            </FormLabel>
                                            <Select
                                              onValueChange={field.onChange}
                                              defaultValue={field.value}
                                            >
                                              <FormControl>
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select a storage mode" />
                                                </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                <SelectItem value="password-protected">
                                                  Password Protected
                                                </SelectItem>
                                                <SelectItem value="plain-text">
                                                  Plain Text
                                                </SelectItem>
                                                <SelectItem value="null">
                                                  No Storage Mode
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                            <FormDescription>
                                              Plaintext PEM files are still
                                              available (e.g. for use in
                                              non-interactive situations like
                                              CI), but not recommended for use
                                              since they put the keys at risk.
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <FormField
                                        control={newIdentityForm.control}
                                        name="force"
                                        render={({ field }) => (
                                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                              />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                              <FormLabel>Force</FormLabel>
                                              <FormDescription>
                                                If the identity already exists,
                                                remove and re-import it.
                                              </FormDescription>
                                            </div>
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowCreateIdentityDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Create</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </TabsContent>
                  <TabsContent value="import">
                    <Form {...importIdentityForm}>
                      <form
                        onSubmit={importIdentityForm.handleSubmit(
                          onimportIdentityFormSubmit
                        )}
                      >
                        <DialogHeader className="space-y-3">
                          <DialogTitle>Import Identity</DialogTitle>
                          <DialogDescription>
                            Create a user identity by importing the user’s key
                            information or security certificate from a PEM file.
                          </DialogDescription>
                        </DialogHeader>
                        <div>
                          <div className="space-y-4 py-4 pb-6">
                            <div className="space-y-3">
                              <FormField
                                control={newIdentityForm.control}
                                name="identity_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-small">
                                      Identity Name
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        id="identity_name"
                                        placeholder="alice"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="space-y-3">
                              <FormField
                                control={importIdentityForm.control}
                                name="pem_identity"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-small">
                                      Pem File
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        id="pem_identity"
                                        type="file"
                                        placeholder="alice"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Accordion type="single" collapsible>
                              <AccordionItem value="item-1">
                                <AccordionTrigger>Options</AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-4">
                                    <div className="space-y-3">
                                      <FormField
                                        control={importIdentityForm.control}
                                        name="storage_mode"
                                        render={({ field }) => (
                                          <FormItem className="space-y-3">
                                            <FormLabel>
                                              Storage Mode (Optional)
                                            </FormLabel>
                                            <Select
                                              onValueChange={field.onChange}
                                              defaultValue={field.value}
                                            >
                                              <FormControl>
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select a storage mode" />
                                                </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                <SelectItem value="password-protected">
                                                  Password Protected
                                                </SelectItem>
                                                <SelectItem value="plain-text">
                                                  Plain Text
                                                </SelectItem>
                                                <SelectItem value="null">
                                                  No Storage Mode
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                            <FormDescription>
                                              Plaintext PEM files are still
                                              available (e.g. for use in
                                              non-interactive situations like
                                              CI), but not recommended for use
                                              since they put the keys at risk.
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <FormField
                                        control={importIdentityForm.control}
                                        name="force"
                                        render={({ field }) => (
                                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                              />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                              <FormLabel>Force</FormLabel>
                                              <FormDescription>
                                                If the identity already exists,
                                                remove and re-import it.
                                              </FormDescription>
                                            </div>
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowCreateIdentityDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Import</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-8">
            {identities.slice(0, 6).map((identity) => identityCard(identity))}
          </div>
        </>
      ) : (
        <div>"No identities found"</div>
      )}
    </div>
  );
}
