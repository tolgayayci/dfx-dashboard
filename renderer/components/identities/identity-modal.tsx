"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Checkbox } from "@components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";

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

export default function IdentityModal({
  showCreateIdentityDialog,
  setShowCreateIdentityDialog,
}) {
  const handleLogin = async () => {
    try {
      await loginWithII();
      // console.log(identity);
    } catch (error) {
      console.error("Error invoking remote method:", error);
    }
  };

  const newIdentityForm = useForm<z.infer<typeof newIdentityFormSchema>>({
    resolver: zodResolver(newIdentityFormSchema),
  });

  const importIdentityForm = useForm<z.infer<typeof importIdentityFormSchema>>({
    resolver: zodResolver(importIdentityFormSchema),
  });

  return (
    <Dialog open={showCreateIdentityDialog}>
      <DialogContent>
        <Tabs defaultValue="new-identity">
          <TabsList className="mb-4">
            <TabsTrigger value="new-identity">New Identity</TabsTrigger>
            <TabsTrigger value="import">Import Existing</TabsTrigger>
            <TabsTrigger value="internet-identity">
              Internet Identity
            </TabsTrigger>
          </TabsList>
          <TabsContent value="new-identity">
            <Form {...newIdentityForm}>
              <form
                onSubmit={newIdentityForm.handleSubmit(onNewIdentityFormSubmit)}
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
                    onClick={() => setShowCreateIdentityDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Import</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="internet-identity">
            <Form {...importIdentityForm}>
              <form
                onSubmit={importIdentityForm.handleSubmit(
                  onimportIdentityFormSubmit
                )}
              >
                <DialogHeader className="space-y-3 mb-5">
                  <DialogTitle>Login with Internet Identity</DialogTitle>
                  <DialogDescription>
                    You can use Internet Identity to login to the Internet
                    Computer.
                  </DialogDescription>
                  {/* {authClient &&
                  authClient.getIdentity() &&
                  authClient.isAuthenticated() &&
                  !isError.error ? (
                    <Alert className="mt-4">
                      <AlertTitle className="mb-1 text-[13px] font-bold">
                        You are currently logged in as:
                      </AlertTitle>
                      <AlertDescription>
                        {authClient.getIdentity().getPrincipal().toText()}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="mt-4" variant="destructive">
                      <AlertTitle>There is an error!</AlertTitle>
                      <AlertDescription>{isError.message}</AlertDescription>
                    </Alert>
                  )} */}
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateIdentityDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleLogin}>Login</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
