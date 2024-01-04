import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@components/ui/select";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { AlertCircle, ThumbsUpIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { commands } from "@lib/commands";
import { Checkbox } from "@components/ui/checkbox";
import { Label } from "@components/ui/label";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";

import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";

import useProject from "renderer/hooks/useProject";

const CliCommandSelector = ({ canister }) => {
  const [selectedCommand, setSelectedCommand] = useState("");
  const [commandArgs, setCommandArgs] = useState({});
  const [commandOptions, setCommandOptions] = useState({});
  const [isRunningCommand, setIsRunningCommand] = useState(false);
  const [commandOutput, setCommandOutput] = useState("");
  const [commandError, setCommandError] = useState("");

  const { project } = useProject();

  const handleCommandChange = (commandValue) => {
    setSelectedCommand(commandValue);
    const command = commands.find((c) => c.value === commandValue);

    // Initialize arguments
    if (command && command.args) {
      const argsInitialState = {};
      command.args.forEach((arg) => {
        argsInitialState[arg.name] = "";
      });
      setCommandArgs(argsInitialState);
    } else {
      setCommandArgs({});
    }

    // Initialize options
    if (command && command.options) {
      const optionsInitialState = {};
      command.options.forEach((option) => {
        optionsInitialState[option.name] = "";
      });
      setCommandOptions(optionsInitialState);
    } else {
      setCommandOptions({});
    }
  };

  const handleRunCommand = async () => {
    setIsRunningCommand(true);
    try {
      await runCli(selectedCommand, Object.values(commandArgs)).then(() => {
        // toast success message
        console.log("Command executed successfully");
      });
    } catch (error) {
      // toast error message
      console.error("Error executing command:", error);
    } finally {
      setIsRunningCommand(false);
    }
  };

  const runCli = async (command, args) => {
    try {
      // Construct the options array, including -- for options
      const optionsArray = Object.entries(commandOptions).reduce(
        (acc, [option, value]) => {
          if (value) {
            // Only add the option if it has a value
            acc.push(`${option}=${value}`);
          }
          return acc;
        },
        []
      );

      // Convert string arguments to integers if necessary
      const processedArgs = args.map((arg) =>
        isNaN(arg) ? arg : parseInt(arg, 10)
      );

      const result = await window.awesomeApi.runDfxCommand(
        "canister",
        command,
        [canister.name, ...processedArgs], // Use processedArgs instead of args
        optionsArray,
        project?.path
      );

      console.log(result);
      setCommandError("");
      setCommandOutput(result);
    } catch (error) {
      setCommandError(`${error.message}`);
      setCommandOutput(""); // Clear any previous output
    }
  };

  return (
    <div className="flex flex-col">
      <ScrollArea className="max-h-[450px] overflow-y-auto">
        <div className="flex flex-col space-y-4">
          <Select
            value={selectedCommand}
            onValueChange={(e) => handleCommandChange(e)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a canister command" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="h-[150px]">
                {commands.map((command) => (
                  <SelectItem key={command.value} value={command.value}>
                    {command.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Accordion type="multiple" className="w-full space-y-2">
            {selectedCommand &&
              commands.find((c) => c.value === selectedCommand)?.options
                ?.length > 0 && (
                <AccordionItem
                  value="options"
                  className="border px-3 rounded-lg"
                >
                  <AccordionTrigger className="text-sm">
                    Options & Flags
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap -mx-2">
                      {selectedCommand &&
                        commands
                          .find((c) => c.value === selectedCommand)
                          ?.options?.filter((option) => option.type === "flag")
                          .map((option, index) => (
                            <div
                              key={option.name}
                              className={`w-1/3 px-2 mb-2 space-x-2 items-center flex ${
                                index % 3 === 0 ? "clear-left" : ""
                              }`} // Adjust width as per your design
                            >
                              <Checkbox
                                id={option.name}
                                checked={!!commandOptions[option.name]}
                                onCheckedChange={(checked) => {
                                  setCommandOptions({
                                    ...commandOptions,
                                    [option.name]: checked,
                                  });
                                }}
                              />

                              <Label htmlFor={option.name}>
                                {option.name}
                                {/* {"(" + option.description + ")"} */}
                              </Label>
                            </div>
                          ))}
                    </div>

                    {selectedCommand &&
                      commands
                        .find((c) => c.value === selectedCommand)
                        ?.options?.filter(
                          (option) => option.type === "argument"
                        )
                        .map((option) => (
                          <div key={option.name} className="space-y-2 my-2">
                            <Label htmlFor={option.name}>
                              {option.description}
                            </Label>
                            <Input
                              type="text"
                              id={option.name}
                              value={commandOptions[option.name] || ""}
                              placeholder={option.placeholder || option.name}
                              onChange={(e) => {
                                setCommandOptions({
                                  ...commandOptions,
                                  [option.name]: e.target.value,
                                });
                              }}
                            />
                          </div>
                        ))}
                  </AccordionContent>
                </AccordionItem>
              )}
          </Accordion>
        </div>
        <ScrollBar />
      </ScrollArea>
      {isRunningCommand ? (
        <Button disabled>
          {" "}
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Command Running...
        </Button>
      ) : (
        <Button
          className={selectedCommand ? "mt-4" : ""}
          onClick={handleRunCommand}
        >
          Run Command
        </Button>
      )}
      <div className="mt-4">
        {commandOutput && (
          <Alert variant="success">
            <ThumbsUpIcon className="h-4 w-4 text-green-600" />
            <AlertTitle>Command Output</AlertTitle>
            <AlertDescription>{commandOutput}</AlertDescription>
          </Alert>
        )}
        {commandError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{commandError}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default CliCommandSelector;
