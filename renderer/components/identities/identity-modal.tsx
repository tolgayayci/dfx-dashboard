"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Checkbox } from "@components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Loader2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

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

import { loginWithII } from "@components/identities/auth";

import { useToast } from "@components/ui/use-toast";
import {
  identityCreateSuccess,
  identityCreateError,
  identityImportSuccess,
  identityImportError,
  identityInternetIdentityLoginSuccess,
  identityInternetIdentityLoginError,
} from "@lib/notifications";

export default function IdentityModal({
  showCreateIdentityDialog,
  setShowCreateIdentityDialog,
}) {
  const [isSubmittingCreateIdentity, setIsSubmittingCreateIdentity] =
    useState(false);
  const [isSubmittingImportIdentity, setIsSubmittingImportIdentity] =
    useState(false);
  const [isSubmittingLoginWithII, setIsSubmittingLoginWithII] = useState(false);

  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      await loginWithII().then((res) => {
        if (res) {
          toast(
            identityInternetIdentityLoginSuccess(
              res.identity as unknown as string
            )
          );
          setShowCreateIdentityDialog(false);
        }
      });
    } catch (error) {
      // toast(identityInternetIdentityLoginError("unknown"));
      console.log(error);
    }
  };

  const handleCreateNewIdentity = async (data) => {
    try {
      await onNewIdentityFormSubmit(data).then((res) => {
        //@ts-ignore
        if (res) {
          toast(identityCreateSuccess(res));
          setShowCreateIdentityDialog(false);
        }
      });
    } catch (error) {
      // toast(identityCreateError(error));
      console.log(error);
    } finally {
      setShowCreateIdentityDialog(false);
    }
  };

  const handleImportIdentity = async (data) => {
    try {
      await onimportIdentityFormSubmit(data).then((res) => {
        //@ts-ignore
        if (res) {
          toast(identityImportSuccess(res));
          setShowCreateIdentityDialog(false);
        }
      });
    } catch (error) {
      // toast(identityImportError(error));
      console.log(error);
    } finally {
      setShowCreateIdentityDialog(false);
    }
  };

  const newIdentityForm = useForm<z.infer<typeof newIdentityFormSchema>>({
    resolver: zodResolver(newIdentityFormSchema),
  });

  const importIdentityForm = useForm<z.infer<typeof importIdentityFormSchema>>({
    resolver: zodResolver(importIdentityFormSchema),
  });

  return (
    <Dialog
      open={showCreateIdentityDialog}
      onOpenChange={() => setShowCreateIdentityDialog(false)}
    >
      <DialogContent>
        <Tabs defaultValue="new-identity">
          <TabsList className="mb-4">
            <TabsTrigger value="new-identity">New Identity</TabsTrigger>
            <TabsTrigger value="import">Import Existing</TabsTrigger>
            <TabsTrigger value="internet-identity" disabled>
              Internet Identity (Soon)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="new-identity">
            <Form {...newIdentityForm}>
              <form
                onSubmit={newIdentityForm.handleSubmit(handleCreateNewIdentity)}
              >
                <DialogHeader className="space-y-3">
                  <DialogTitle>Create New Identity</DialogTitle>
                  <DialogDescription>
                    Identities you will add are global. They are not confined to
                    a specific project context.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[340px] overflow-y-auto">
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
                                        Plaintext PEM files are still available
                                        (e.g. for use in non-interactive
                                        situations like CI), but not recommended
                                        for use since they put the keys at risk.
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
                                          If the identity already exists, remove
                                          and re-import it.
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
                  <ScrollBar />
                </ScrollArea>
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowCreateIdentityDialog(false)}
                  >
                    Cancel
                  </Button>
                  {isSubmittingCreateIdentity ? (
                    <Button disabled>
                      {" "}
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </Button>
                  ) : (
                    <Button type="submit">Create</Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="import">
            <Form {...importIdentityForm}>
              <form
                onSubmit={importIdentityForm.handleSubmit(handleImportIdentity)}
              >
                <DialogHeader className="space-y-3">
                  <DialogTitle>Import Identity</DialogTitle>
                  <DialogDescription>
                    Create a user identity by importing the user’s key
                    information or security certificate from a PEM file.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[335px] overflow-y-auto">
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
                                        Plaintext PEM files are still available
                                        (e.g. for use in non-interactive
                                        situations like CI), but not recommended
                                        for use since they put the keys at risk.
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
                                          If the identity already exists, remove
                                          and re-import it.
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
                </ScrollArea>
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowCreateIdentityDialog(false)}
                  >
                    Cancel
                  </Button>
                  {isSubmittingImportIdentity ? (
                    <Button disabled>
                      {" "}
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </Button>
                  ) : (
                    <Button type="submit">Import</Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="internet-identity">
            <DialogHeader className="space-y-3 mb-5">
              <DialogTitle>Login with Internet Identity</DialogTitle>
              <DialogDescription>
                You can use Internet Identity to login to the Internet Computer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowCreateIdentityDialog(false)}
              >
                Cancel
              </Button>
              {isSubmittingLoginWithII ? (
                <Button disabled>
                  {" "}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing...
                </Button>
              ) : (
                <Button type="button" onClick={handleLogin}>
                  Login
                </Button>
              )}
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
