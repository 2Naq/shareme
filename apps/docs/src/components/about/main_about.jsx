import Link from "@docusaurus/Link";
import VerifiedIcon from "@site/src/components/icons/verified.svg";
import GithubIcon from "@site/src/components/icons/github";
import Separator from "@site/src/components/Separator";
import { ArrowUpRight, CodeXml, Mail, MapPin, MoveRight } from "lucide-react";
import { myData } from "@site/src/constants/my_data";
import Translate from "@docusaurus/Translate";
import { cn } from "@/lib/utils";

const infor = [
  {
    name: <Translate>Role</Translate>,
    value: <Translate>{myData.level}</Translate>,
    icon: CodeXml,
  },
  {
    name: <Translate>Location</Translate>,
    value: <Translate>{myData.address}</Translate>,
    icon: MapPin,
  },
  {
    name: <Translate>Email</Translate>,
    value: myData.email,
    icon: Mail,
    link: `mailto:${myData.email}`,
  },
  {
    name: <Translate>GitHub</Translate>,
    value: "@2Naq",
    icon: GithubIcon,
    link: myData.link_github,
  },
];

function MainAbout() {
  return (
    <>
      <main className="max-w-screen overflow-x-hidden px-2 font-mono bg-background text-foreground">
        <div className="flex p-5">
          <div
            className={cn(
              "h-64 w-full flex items-center justify-center flex-col relative",
              "bg-size-[40px_40px] bg-center",
              "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
              "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
              "mask-[radial-gradient(ellipse_at_center,black_95%,transparent_80%)]"
            )}
          >
            <div className="shimmer">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight bg-linear-to-b from-zinc-950 via-slate-900 to-zinc-700 dark:from-white dark:via-zinc-200 dark:to-zinc-500 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                {myData.brand_name}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {myData.sub_brand}
            </p>
          </div>
        </div>
        <div className="mx-auto md:max-w-3xl border-edge border-x min-h-screen">
          <Separator />
          <div className="border-edge flex flex-row sm:flex-row">
            <div className="shrink-0 border-r border-edge p-2">
              <div className="mx-0.5 my-0.75">
                <img
                  src={myData.avt}
                  alt="Avatar"
                  className="size-32 rounded-full ring-1 ring-border ring-offset-2 ring-offset-background select-none sm:size-40"
                />
              </div>
            </div>

            <div className="w-full sm:w-2/3 flex flex-col flex-1">
              <Separator className="grow border-none before:hidden bg-separator" />
              <div className="border-t border-edge p-4">
                <h1 className="text-3xl font-semibold flex items-center gap-2 mb-1">
                  {`${myData.fullName || "anTng"} (${myData.user_name})`}
                  <VerifiedIcon className="size-[0.6em] text-blue-500" />
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 m-0">
                  <Translate>{myData.title}</Translate>
                </p>
              </div>
            </div>
          </div>
          <Separator />

          {/* === SECTION 2: THÔNG TIN CƠ BẢN (DẠNG TABLE GRID) === */}
          <div className="p-2 sm:p-4">
            <div className="rounded-xl border border-edge overflow-hidden bg-card/30">
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
                        "flex items-center gap-3.5 p-4 border-edge text-inherit no-underline",
                        item.link &&
                          "group hover:bg-muted/30 transition-colors cursor-pointer",
                        isEven && "sm:border-r",
                        !isLastRowOnDesktop && "border-b",
                        !isLast && "max-sm:border-b"
                      )}
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-input/30 bg-muted/40 text-foreground/80 group-hover:text-foreground transition-colors">
                        <item.icon className="size-4" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                          {item.name}
                        </span>
                        <span className="text-sm font-semibold text-foreground truncate">
                          {item.value}
                        </span>
                      </div>
                      {item.link && (
                        <ArrowUpRight className="size-3 hidden group-hover:flex text-muted-foreground/60 group-hover:text-foreground/50 group-hover:translate-x-1 transition-all shrink-0 ml-auto" />
                      )}
                    </Component>
                  );
                })}
              </div>
            </div>
          </div>

          <Separator />

          {/* === SECTION 3: SOCIAL LINKS (Dạng bảng Grid) === */}
          {/* <div className="max-w-3xl mx-auto  grid grid-cols-1 sm:grid-cols-2">
            <a
              href={myData.link_github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-[#141416] transition-colors group no-underline"
            >
              <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-xl text-foreground mr-4 shadow-sm">
                <GithubIcon className="size-5" />
              </div>
              <div className="grow">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 m-0 text-base">
                  GitHub
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 m-0">
                  @2Naq
                </p>
              </div>
              <MoveRight className="size-4 text-foreground/50" />
            </a>
          </div>

          <Separator /> */}

          {/* === SECTION 4: NÚT VÀO DOCS === */}
          <div className="max-w-3xl mx-auto p-6">
            <Link
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-opacity no-underline w-full sm:w-auto"
              to="/docs"
            >
              <Translate>Xem tài liệu</Translate>
              <svg
                className="w-4 h-4"
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
