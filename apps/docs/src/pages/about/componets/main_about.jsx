import Link from "@docusaurus/Link";
import VerifiedIcon from "@site/src/components/icons/verified.svg";
import GithubIcon from "@site/src/components/icons/github";
import Separator from "@site/src/components/Separator";
import { CodeXml, Mail, MapPin, MoveRight } from "lucide-react";
import { myData } from "@site/src/constants/my_data";
import Translate from "@docusaurus/Translate";
import { Marker, MarkerContent } from "@site/src/components/ui/marker";

const infor = [
  {
    name: <Translate>Work / position</Translate>,
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
  },
];

function MainAbout() {
  return (
    <>
      <main className="max-w-screen overflow-x-hidden px-2 font-mono bg-background text-foreground">
        <div className="mx-auto md:max-w-3xl border-edge border-x min-h-screen">
          <div className="aspect-2/1 border-x border-edge select-none sm:aspect-3/1 flex items-center justify-center flex-col text-black dark:text-white screen-line-before screen-line-after before:-top-px after:-bottom-px bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[20px_20px] bg-center">
            <div className="shimmer">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight bg-linear-to-b from-zinc-950 via-slate-900 to-zinc-700 dark:from-white dark:via-zinc-200 dark:to-zinc-500 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                Automation Notes
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Practice - Challenge - Persevere
            </p>
          </div>
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
                  {myData.user_name || "anTng"}
                  <VerifiedIcon className="size-[0.6em] text-blue-500" />
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 m-0">
                  <Translate>{myData.title}</Translate>
                </p>
              </div>
            </div>
          </div>
          <Separator />

          {/* === SECTION 2: THÔNG TIN CƠ BẢN === */}
          <div className="max-w-3xl mx-auto border-x border-edge p-4 sm:p-6 space-y-3">
            {infor.map((item, index) => (
              <div key={index} className="flex items-center gap-4 text-sm">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted dark:inset-shadow-[1px_1px_1px,0px_0px_1px] dark:inset-shadow-white/15">
                  <item.icon className="size-4" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          {/* === SECTION 3: SOCIAL LINKS (Dạng bảng Grid) === */}
          <div className="max-w-3xl mx-auto  grid grid-cols-1 sm:grid-cols-2">
            {/* Box GitHub */}
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

          <Separator />

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
