import Link from "@docusaurus/Link";
import VerifiedIcon from "@site/src/components/icons/verified.svg";
import GithubIcon from "@site/src/components/icons/github";
import Separator from "@site/src/components/Separator";
import {
  ArrowUpRight,
  Pickaxe,
  Mail,
  MapPin,
  FolderKanban,
} from "lucide-react";
import { myData } from "@site/src/constants/my_data";
import { cn } from "@/lib/utils";
import CardProjectAbout from "./card_project_about";

const infor = [
  {
    name: "Work",
    value: myData.work_at,
    icon: Pickaxe,
  },
  {
    name: "Location",
    value: myData.address,
    icon: MapPin,
  },
  {
    name: "Email",
    value: myData.email,
    icon: Mail,
    link: `mailto:${myData.email}`,
  },
  {
    name: "GitHub",
    value: "@2Naq",
    icon: GithubIcon,
    link: myData.link_github,
  },
];

function MainAbout() {
  return (
    <>
      <main className="bg-background text-foreground max-w-screen overflow-x-hidden px-2 font-mono">
        <div className="flex p-5">
          <div
            className={cn(
              "relative flex h-64 w-full flex-col items-center justify-center",
              "bg-size-[40px_40px] bg-center",
              "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
              "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
              "mask-[radial-gradient(ellipse_at_center,black_95%,transparent_80%)]",
            )}
          >
            <div className="shimmer">
              <h1 className="bg-linear-to-b from-zinc-950 via-slate-900 to-zinc-700 bg-clip-text text-4xl font-black tracking-tight text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] sm:text-6xl md:text-7xl dark:from-white dark:via-zinc-200 dark:to-zinc-500 dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                {myData.brand_name}
              </h1>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              {myData.sub_brand}
            </p>
          </div>
        </div>
        <div className="border-edge mx-auto min-h-screen border-x md:max-w-3xl">
          <Separator />
          <div className="border-edge flex flex-row sm:flex-row">
            <div className="border-edge shrink-0 border-r p-2">
              <div className="mx-0.5 my-0.75">
                <img
                  src={myData.avt}
                  alt="Avatar"
                  className="ring-border ring-offset-background size-32 rounded-full ring-1 ring-offset-2 select-none sm:size-40"
                />
              </div>
            </div>

            <div className="flex w-full flex-1 flex-col sm:w-2/3">
              <Separator className="bg-separator grow border-none before:hidden" />
              <div className="border-edge border-t p-4">
                <h1 className="mb-1 flex items-center gap-2 text-3xl font-semibold">
                  {`${myData.fullName || "anTng"} (${myData.user_name})`}
                  <VerifiedIcon className="size-[0.6em] text-blue-500" />
                </h1>
                <p className="m-0 text-sm text-gray-500 dark:text-gray-400">
                  {myData.title}
                </p>
              </div>
            </div>
          </div>
          <Separator />

          {/* === SECTION 2: THÔNG TIN CƠ BẢN (DẠNG TABLE GRID) === */}
          <div className="p-2 sm:p-4">
            <div className="border-edge bg-card/30 overflow-hidden rounded-xl border">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {infor.map((item, index) => {
                  const isEven = index % 2 === 0;
                  const isLastRowOnDesktop =
                    index >= infor.length - (infor.length % 2 === 0 ? 2 : 1);
                  const isLast = index === infor.length - 1;
                  const Component = item.link ? "a" : "div";

                  return (
                    <Component
                      key={index}
                      href={item?.link}
                      target={
                        item?.link?.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item?.link?.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className={cn(
                        "border-edge flex items-start gap-3.5 p-4 text-inherit no-underline",
                        item.link &&
                          "group hover:bg-muted/30 cursor-pointer transition-colors",
                        isEven && "sm:border-r",
                        !isLastRowOnDesktop && "border-b",
                        !isLast && "max-sm:border-b",
                      )}
                    >
                      <div className="border-input/30 bg-muted/40 text-foreground/80 group-hover:text-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors">
                        <item.icon className="size-4" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                          {item.name}
                        </span>
                        <span className="text-foreground line-clamp-2 text-sm font-semibold">
                          {item.value}
                        </span>
                      </div>
                      {item.link && (
                        <ArrowUpRight className="text-muted-foreground/60 group-hover:text-foreground/50 ml-auto hidden size-3 shrink-0 transition-all group-hover:flex group-hover:translate-x-1" />
                      )}
                    </Component>
                  );
                })}
              </div>
            </div>
          </div>

          <Separator />

          {/* === SECTION 3: PROJECTS === */}
          <div className="p-2 sm:p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="border-input/30 bg-muted/40 text-foreground/80 flex size-7 shrink-0 items-center justify-center rounded-md border">
                <FolderKanban className="size-3.5" />
              </div>
              <h2 className="text-muted-foreground m-0 text-sm font-bold tracking-wide uppercase">
                Projects
              </h2>
            </div>
            <CardProjectAbout />
          </div>

          <Separator />

          {/* === SECTION 4: NÚT VÀO DOCS === */}
          <div className="mx-auto max-w-3xl p-6">
            <Link
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white no-underline transition-opacity hover:opacity-90 sm:w-auto dark:bg-white dark:text-black"
              to="/docs"
            >
              Xem tài liệu
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default MainAbout;
