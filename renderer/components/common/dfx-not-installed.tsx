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

export default function DfxNotInstalled() {
  async function openExternalLink(url: string) {
    try {
      const result = await window.awesomeApi.openExternalLink(url);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  async function reloadApplication() {
    try {
      await window.awesomeApi.reloadApplication();
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>DFX is not installed!</AlertDialogTitle>
          <AlertDialogDescription>
            You need to install DFX to use this application. Please visit the
            Internet Computer documentation to learn how to use dfx.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => reloadApplication() as any}>
            Reload Application
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              openExternalLink(
                "https://internetcomputer.org/docs/current/developer-docs/getting-started/install/#installing-dfx"
              ) as any
            }
          >
            Visit Documentation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
