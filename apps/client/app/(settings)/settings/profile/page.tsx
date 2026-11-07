import { UpdateUserForm } from "@/components/user/UpdateUserForm";

export default function RoutePage() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 pt-16 pb-20">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
          Profile
        </h1>
        <UpdateUserForm />
      </div>
    </div>
  );
}
