// Projects Notifications
export const projectCreateSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been created successfully.`,
});

export const projectCreateError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to create ${contentName}.`,
});

export const projectImportSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been imported successfully.`,
});

export const projectImportError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to import ${contentName}.`,
});

export const projectRenameSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been renamed successfully.`,
});

export const projectRenameError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to rename ${contentName}.`,
});

export const projectRemoveSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been removed successfully.`,
});

export const projectRemoveError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to remove ${contentName}.`,
});

// --- Identity Notifications ---

export const identityCreateSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been created successfully.`,
});

export const identityCreateError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to create ${contentName}.`,
});

export const identityImportSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been imported successfully.`,
});

export const identityImportError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to import ${contentName}.`,
});

export const identityInternetIdentityLoginSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been logged in successfully.`,
});

export const identityInternetIdentityLoginError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to log in ${contentName}.`,
});

export const identityRenameSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been renamed successfully.`,
});

export const identityRenameError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to rename ${contentName}.`,
});

export const identityRemoveSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been removed successfully.`,
});

export const identityRemoveError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to remove ${contentName}.`,
});
