"use client";

import { useEffect, useState } from "react";

import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { cn } from "@lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@components/ui/command";

import { Dialog, DialogTrigger } from "@components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";

import { UpdateIcon } from "@radix-ui/react-icons";

import { useRouter } from "next/router";
import ProjectModal from "@components/projects/project-modal";

type Project = {
  name: string;
  path: string;
};

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function ProjectSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const router = useRouter();

  async function checkProjects() {
    try {
      const result = await window.awesomeApi.manageProjects("get");
      const projectsData = result.map((project) => ({
        name: project.name,
        path: project.path,
        active: project.active, // Assuming 'active' property is part of your project data
      }));

      // Find an active project
      const activeProject = projectsData.find((project) => project.active);

      // Set the selected project to the active one if it exists, otherwise set to the first project
      if (activeProject) {
        setSelectedProject(activeProject);
      } else if (projectsData.length > 0) {
        setSelectedProject(projectsData[0]);
      }

      // Update the projects state
      setProjects(projectsData);
    } catch (error) {
      console.log("Error invoking remote method:", error);
    }
  }

  const handleSelectProject = async (project) => {
    try {
      // Update the project's active status
      await window.awesomeApi.manageProjects("update", {
        ...project,
        active: true,
      });

      setSelectedProject(project);

      // Refresh the projects list to reflect the change
      await checkProjects();
    } catch (error) {
      console.error("Error while updating project status:", error);
    }
  };

  const groups = [
    {
      label: "Selected Project",
      teams: selectedProject ? [selectedProject] : [],
    },
    {
      label: "Projects",
      teams: projects,
    },
  ];

  useEffect(() => {
    checkProjects();
  }, []);

  return (
    <Dialog
      open={showNewTeamDialog}
      onOpenChange={() => setShowNewTeamDialog(false)}
    >
      <Popover open={open} onOpenChange={setOpen}>
        {selectedProject ? (
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select a team"
              className={cn("w-full justify-between", className)}
            >
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${selectedProject.name}.png`}
                  alt={selectedProject.name}
                />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              {selectedProject.name}
              <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
        ) : null}
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No projects found</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map((team) => (
                    <CommandItem
                      key={team.name}
                      onSelect={() => {
                        handleSelectProject(team);
                        setOpen(false);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.name}.png`}
                          alt={team.name}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {team.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedProject.path === team.path
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create New Project
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    router.push("/projects");
                  }}
                >
                  <UpdateIcon className="mr-2 h-5 w-5" />
                  Edit Projects
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <ProjectModal
        showNewProjectDialog={showNewTeamDialog}
        setShowNewProjectDialog={setShowNewTeamDialog}
        onProjectChange={checkProjects}
      />
    </Dialog>
  );
}
