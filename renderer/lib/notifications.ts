// Projects Notifications
export const projectCreateSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been created successfully.`,
  duration: 2000,
});

export const projectCreateError = (contentName: string, error: string) => ({
  title: "Error",
  description: `Failed to create ${contentName}. ${error}`,
  duration: 2000, 
});

export const projectImportSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been imported successfully.`,
  duration: 2000,
});

export const projectImportError = (contentName: string) => ({
  title: "Error",
  description: `Failed to import ${contentName}. Make sure you selected root folder that containing dfx.json.`,
  duration: 2000,
});

export const projectRenameSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been renamed successfully.`,
  duration: 2000,
});

export const projectRenameError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to rename ${contentName}.`,
  duration: 2000,
});

export const projectRemoveSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been removed successfully.`,
  duration: 2000,
});

export const projectRemoveError = (contentName: string, error: string) => ({
  title: "Error",
  description: `Failed to remove ${contentName}. ${error}`,
  duration: 2000,
});

// --- Identity Notifications ---

export const identityCreateSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been created successfully.`,
  duration: 2000, 
});

export const identityCreateError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to create ${contentName}.`,
  duration: 2000,
});

export const identityImportSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been imported successfully.`,
  duration: 2000,
});

export const identityImportError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to import ${contentName}.`,
  duration: 2000,
});

export const identityInternetIdentityLoginSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been logged in successfully.`,
  duration: 2000,
});

export const identityInternetIdentityLoginError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to log in ${contentName}.`,
  duration: 2000,
});

export const identityRenameSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been renamed successfully.`,
  duration: 2000,
});

export const identityRenameError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to rename ${contentName}.`,
  duration: 2000,
});

export const identityRemoveSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been removed successfully.`,
  duration: 2000,
});

export const identityRemoveError = (contentName: string) => ({
  variant: "destructive",
  title: "Error",
  description: `Failed to remove ${contentName}.`,
  duration: 2000,
});

export const protectedIdentityRemoveError = (contentName: string) => ({
  title: "Error",
  description: `Failed to remove ${contentName}. You can't delete the ${contentName} identity!`,
  duration: 2000,
});
