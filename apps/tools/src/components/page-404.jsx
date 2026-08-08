import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SvgLoading from "./loading";

export default function Page404() {
  return (
    <>
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-primary text-base font-semibold">404</p>
          <h1 className="text-foreground mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
            Page not found
          </h1>
          <p className="text-muted-foreground mt-6 text-lg font-medium text-pretty sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="flex justify-center">
            <SvgLoading />
          </div>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/">
              <Button className="h-10 flex-row items-center justify-center">
                <ArrowLeft className="h-4 w-4" /> Go home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
