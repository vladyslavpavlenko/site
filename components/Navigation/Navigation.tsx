import Link from "next/link";
import { useRouter } from "next/router";
import { Command } from "cmdk";
import { useState, useEffect } from "react";
import { FaLinkedin as LinkedInIcon, FaGithub as GitHubIcon, FaBook } from 'react-icons/fa';
import { FaMoon } from "react-icons/fa6";
import { MdAlternateEmail } from 'react-icons/md'
import { RiQuillPenAiFill } from "react-icons/ri";
import { IoIosSunny } from "react-icons/io";
import {
  HomeIcon,
  NavigationIcon,
  SpinnerIcon,
} from "../Icons/Icons";
import { useDarkMode } from "../../lib/useDarkMode";
import { CSSTransitionGroup } from "react-transition-group";
import { Tooltip } from "../Tooltip/Tooltip";
import { GlassElement } from "../GlassElement/GlassElement";

enum TooltipState {
  HOME,
  MENU,
}

export default function Navigation() {
  const router = useRouter();
  const currentRoute = router.pathname;
  const isHome = currentRoute === "/";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>(undefined);
  const { isDark, toggleDarkMode } = useDarkMode();

  const navigate = async (href) => {
    if (!href) return;
    setLoading(true);

    if (href.includes("mailto:")) {
      window.location.href = href;
    } else if (href.includes("//")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else if (href === currentRoute) {
      await router.replace(href);
    } else {
      await router.push(href);
    }

    setLoading(false);
    setOpen(false);
  };

  useEffect(() => {
    // Prefetch menu
    router.prefetch("/posts");
    router.prefetch("/library");

    // Toggle the menu when ⌘K is pressed
    const down = (e) => {
      if (e.keyCode === 75 && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [router]);

  // Removed displacement filter effect for better performance
  // The menu now uses only CSS backdrop-blur which is much more performant

  return (
    <>
      <Command.Dialog open={open} onOpenChange={setOpen}>
        <Command.Input placeholder="Go to..." />

        <Command.List>
          {loading && (
            <Command.Loading>
              <div>
                <SpinnerIcon size={24} />
              </div>
            </Command.Loading>
          )}

          <Command.Empty>Maybe someday...</Command.Empty>

          <Command.Group heading="Pages">
            <Command.Item onSelect={() => navigate("/")}>
              <div className="flex items-center gap-2">
                <HomeIcon size={16} />
                Home
              </div>
            </Command.Item>
            <Command.Item onSelect={() => navigate("/posts")}>
              <div className="flex items-center gap-2">
                <RiQuillPenAiFill size={16} />
                Posts
              </div>
            </Command.Item>
            <Command.Item onSelect={() => navigate("/library")}>
              <div className="flex items-center gap-2">
                <FaBook size={16} />
                Library
              </div>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Contact">
            <Command.Item onSelect={() => navigate("//linkedin.com/in/vladyslavpavlenko")}>
              <div>
                <LinkedInIcon size={16} />
                LinkedIn
              </div>
            </Command.Item>
            <Command.Item onSelect={() => navigate("//github.com/vladyslavpavlenko")}>
              <div>
                <GitHubIcon size={16} />
                GitHub
              </div>
            </Command.Item>
            <Command.Item onSelect={() => navigate("mailto:xyz.pavlenko@gmail.com")}>
              <div>
                <MdAlternateEmail size={17} />
                Email
              </div>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Preferences">
            <Command.Item
              onSelect={() => {
                toggleDarkMode();
                setOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                {isDark ? <IoIosSunny size={16} /> : <FaMoon size={16} />}
                {isDark ? "Light mode" : "Dark mode"}
              </div>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>

      <nav
        className={`${
          isHome ? "w-12" : "w-28"
        } fixed bottom-6 left-6 top-auto z-10 md:bottom-auto md:left-8 md:top-8`}
      >
        <div>
          <CSSTransitionGroup
            className="relative flex h-12 gap-2"
            transitionName="island"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {!isHome ? (
              <div
                className="absolute left-0"
                onMouseEnter={() => setTooltip(TooltipState.HOME)}
                onMouseLeave={() => setTooltip(undefined)}
              >
                <Tooltip open={tooltip === TooltipState.HOME}>Home</Tooltip>
                <GlassElement
                  width={48}
                  height={48}
                  radius={24}
                  depth={8}
                  blur={2}
                  strength={100}
                  chromaticAberration={0}
                  className="inline-flex items-center justify-center hover:scale-110 active:scale-90 transition-all will-change-transform"
                >
                  <Link href="/" className="flex items-center justify-center w-full h-full">
                  <span className="sr-only">Go home</span>
                  <HomeIcon size={20} />
                </Link>
                </GlassElement>
              </div>
            ) : null}
            <div
              className={`duration-250 absolute transition-all ease-out-expo ${
                !isHome ? "delay-50 left-14" : "left-0 delay-300"
              }`}
              onMouseEnter={() => setTooltip(TooltipState.MENU)}
              onMouseLeave={() => setTooltip(undefined)}
            >
              <Tooltip open={tooltip === TooltipState.MENU}>Menu</Tooltip>
              <GlassElement
                width={48}
                height={48}
                radius={24}
                depth={8}
                blur={2}
                strength={100}
                chromaticAberration={0}
                className="inline-flex items-center justify-center hover:scale-110 active:scale-90 transition-all will-change-transform"
                onClick={() => setOpen((open) => !open)}
              >
                <span className="sr-only">Open menu</span>
                <NavigationIcon size={20} />
              </GlassElement>
            </div>
          </CSSTransitionGroup>
        </div>
      </nav>
    </>
  );
}
