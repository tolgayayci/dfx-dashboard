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
      console.log(`Result: ${result}`);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  async function reloadApplication() {
    try {
      const result = await window.awesomeApi.reloadApplication();
      console.log(`Result: ${result}`);
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
            DFX website for more information by clicking the button below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => reloadApplication() as any}>
            Reload Application
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              openExternalLink(
                "https://support.dfinity.org/hc/en-us/articles/10552713577364-How-do-I-install-dfx-"
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
