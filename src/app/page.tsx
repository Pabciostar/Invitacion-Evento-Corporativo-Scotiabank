import { RsvpForm } from "@/components/rsvp-form";
import { Building2 } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center justify-center rounded-full bg-primary p-3">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Scotiabank
          </h1>
          <p className="mt-2 text-muted-foreground">
            Te invita a su evento corporativo
          </p>
        </div>
        <RsvpForm />
      </div>
    </main>
  );
}
