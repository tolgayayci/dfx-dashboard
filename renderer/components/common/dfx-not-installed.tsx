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
            repository for more information.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => reloadApplication() as any}>
            Reload Application
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              openExternalLink(
                "https://github.com/tolgayayci/dfinity-dfx-gui"
              ) as any
            }
          >
            Visit Website
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
