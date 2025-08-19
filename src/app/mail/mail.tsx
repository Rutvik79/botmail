"use client";

import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanelGroup,
  ResizablePanel,
} from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountSwitcher from "./account-switcher";
import Sidebar from "./sidebar";
import { useLocalStorage } from "usehooks-ts";
import ThreadList from "./thread-list";
import ThreadDisplay from "./thread-display";

type Props = {
  defaultLayout: number[] | undefined;
  navCollapsedSize: number;
  defaultCollapsed: boolean;
};

const Mail = ({
  defaultLayout = [20, 32, 48],
  navCollapsedSize,
  defaultCollapsed,
}: Props) => {
  const [done, setDone] = useLocalStorage("normalhuman-done", false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          console.log(sizes);
        }}
        className="h-full min-h-screen items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={40}
          onCollapse={() => {
            setIsCollapsed(true);
          }}
          onResize={() => {
            setIsCollapsed(false);
          }}
          className={cn(
            isCollapsed &&
              "tranisition-all min-w-[50px] duration-300 ease-in-out",
          )}
        >
          <div className="flex h-full flex-1 flex-col">
            <div
              className={cn(
                "flex h-[52px] items-center justify-between",
                isCollapsed ? "h-[52px]" : "px-2",
              )}
            >
              {/* Account Switcher */}
              <AccountSwitcher isCollapsed={isCollapsed} />
            </div>
            <Separator />
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} />
            <div className="flex-1"></div>
            {/* Ask Ai */}
            Ask AI
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle></ResizableHandle>
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs
            defaultValue="inbox"
            value={done ? "done" : "inbox"}
            onValueChange={(tab) => {
              if (tab === "done") {
                setDone(true);
              } else {
                setDone(false);
              }
            }}
          >
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="inbox"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Inbox
                </TabsTrigger>
                <TabsTrigger
                  value="done"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Done
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            {/* search bar */}
            Search Bar
            <TabsContent value="inbox">
              <ThreadList />
            </TabsContent>
            <TabsContent value="done">
              <ThreadList />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <ThreadDisplay />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};

export default Mail;
